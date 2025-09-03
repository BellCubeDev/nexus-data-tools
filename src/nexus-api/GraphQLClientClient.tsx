"use client";

import { ApolloNextAppProvider, NextSSRInMemoryCache, NextSSRApolloClient, SSRMultipartLink } from "@apollo/experimental-nextjs-app-support/ssr";
import { ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import httpLinkOptions from "./GraphQLApolloConfig";
import applicationUA from "@/user-agent";
import meta from '../../package.json';

function makeClient() {
    const clientHttpLink = new HttpLink(Object.assign({}, httpLinkOptions, {uri: typeof window === "undefined" ? `http://localhost:${process.env.PORT}/api/nexus-graphql/` : '/api/nexus-graphql/'}));

    return new NextSSRApolloClient({
        cache: new NextSSRInMemoryCache(),
        link: typeof window !== "undefined" ? clientHttpLink :
            ApolloLink.from([
                new SSRMultipartLink({ stripDefer: true, }),
                clientHttpLink,
            ]),
        uri: clientHttpLink.options.uri,
        headers: {
            'X-Real-User-Agent': `${applicationUA} ApolloClient/${meta.dependencies["@apollo/client"]} ${typeof navigator === 'undefined' ? 'NodeJS' : navigator.userAgent}`,
        }
    });
}

export function ApolloWrapper({ children }: {children: React.ReactNode}) {
    return (
        <ApolloNextAppProvider makeClient={makeClient}>
            {children}
        </ApolloNextAppProvider>
    );
}

if (process.env.NODE_ENV !== 'production')
    import("@apollo/client/dev").then(a => {
        a.loadErrorMessages();
        a.loadDevMessages();
    });
