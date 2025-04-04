import { NextRequest, NextResponse } from "next/server";
import { inspect } from "util";

// proxy https://api.nexusmods.com/v2/graphql
export const runtime = 'edge';

export async function POST(req: NextRequest) {
    const res = await fetch("https://api.nexusmods.com/v2/graphql", {
        headers: {
            "Authorization": req.headers.get("Authorization") || '',
            "Content-Type": "application/json",
            "User-Agent": req.headers.get("User-Agent") || '',
        },
        body: req.body,
        method: "POST",
        // @ts-ignore - Node says it's needed so it's needed. idk man
        duplex: 'half',
    });

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
        console.log('Response body:', await new Response(body2, res).text());
        throw e;
    }
}
