import { NextRequest, NextResponse } from "next/server";
import { inspect } from "util";
import meta from '../../../../package.json';

// proxy https://api.nexusmods.com/v2/graphql
export const runtime = 'edge';

export async function POST(req: NextRequest) {
    const requestInfo: RequestInit = {
        headers: {
            "Authorization": req.headers.get("Authorization") || '',
            "Content-Type": "application/json",
            "User-Agent": `NexusDataToolsAPIProxy/${meta.version} ${req.headers.get("X-Real-User-Agent") || req.headers.get("User-Agent") || ''}`,
        },
        body: req.body,
        method: "POST",
        // @ts-ignore - Node says it's needed so it's needed. idk man
        duplex: 'half',
    };

    const proxyRequestForLogging = new Request("https://api.nexusmods.com/v2/graphql", requestInfo);
    const proxyRequest = new Request("https://api.nexusmods.com/v2/graphql", requestInfo);

    const res = await fetch(proxyRequest);

    if (!res.body) throw new Error('No body in response from Nexus GraphQL API');

    const [body1, body2] = res.body.tee();

    const readTextResCopy = new Response(body1, res);
    try {
        const json = await readTextResCopy.json();

        console.log('Proxied Nexus GraphQL request:', req.url, res.status, res.statusText, JSON.stringify(json, null, 4));

        return NextResponse.json(json, {
            ...res,
            headers: {
                ...res.headers,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "*",
            },
        });
    } catch (e) {
        console.error('Failed to parse JSON from Nexus GraphQL API:', req.url, res.status, res.statusText, e);
        const [loggingBody, returningBody] = body2.tee();
        console.log('Response body:', await new Response(loggingBody, res).text());
        console.log('Original request', req);
        console.log('Proxied request', proxyRequestForLogging);
        return new NextResponse(returningBody, res);
    }
}
