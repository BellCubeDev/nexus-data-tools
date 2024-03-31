import { Metadata, Viewport } from 'next';
import './global.scss';

import { config as FontAwesomeConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
FontAwesomeConfig.autoAddCss = false;

import { Roboto } from 'next/font/google';
import { SourceCodePro } from './SourceCodePro';
import { ApolloWrapper } from '@/nexus-api/GraphQLClientClient';
const roboto = Roboto({
    display: 'block',
    weight: ['400', '500', '700'],
    subsets: ['latin-ext'],
});

// Exported directly in page.js as well to avoid a strange bugs or two
export const metadata: Metadata = {
    title: "Nexus Data Tools",
    description: "A collection of tools for gathering, visualizing, and manipulating data from Nexus Mods",
    applicationName: "Nexus Data Tools",
    authors: [{
        name: "BellCube",
        url: "https://bellcube.dev",
    }],
    category: "Tool",
    classification: "Development",
    formatDetection: {
        address: false,
        date: false,
        email: false,
        telephone: false,
        url: false,
    },
    icons: undefined, // TODO: Create icon
    keywords: [
        'Nexus Mods',
        'Data Tools',
        'Data Visualizer',
        'Files by Hash',
        'File Hashes',
        'Search Files by Hash',
        'Nexus API',
        'Nexus Data',
        'Nexus Mods API',
        'Nexus Mods Data',
    ],
    manifest: undefined, // TODO: Add manifest for PWA
    metadataBase: new URL('https://ndt.bellcube.dev'),
    openGraph: {
        type: 'website',
        siteName: 'Nexus Data Tools',
        url: 'https://ndt.bellcube.dev',
        images: undefined, // TODO: Create icon
        determiner: 'the',
        locale: 'en',
    },
    twitter: {
        card: 'summary',
    },

    generator: 'Next.js',

    referrer: 'strict-origin',
    other: {
        'opener': 'noopener',
        'darkreader-lock': 'true',
    },



};

export const viewport: Viewport = {
    colorScheme: 'dark',
    width: 'device-width',
    height: 'device-height',
    initialScale: 1,
    interactiveWidget: 'overlays-content',
    maximumScale: 1,
    minimumScale: 1,
    themeColor: '#0074a9',
    userScalable: false,
    viewportFit: 'cover',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return <html lang='en'>
        <head><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "http://schema.org",
            "@type": "SoftwareApplication",
            name: "Nexus Data Tools",
            image: "https://nds.bellcube.dev/logo/logo.webp",
            url: "https://ndt.bellcube.dev/",
            author: {
                "@type": "Person",
                name: "BellCube",
                givenName: "Zack",
            },
            applicationCategory: "BrowserApplication",
            applicationSubCategory: "WebApp",
            dateModified: new Date().toISOString(),
            isAccessibleForFree: true,
            license: 'MIT',
            maintainer: {
                "@type": "Person",
                name: "BellCube",
                givenName: "Zack",
            },
            offers: {
                "@type": "Offer",
                price: 0,
                priceCurrency: "USD",
            },
            aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: 5,
                reviewCount: 0,
            },
            operatingSystem: "Windows, Mac, Linux"//, Android, iOS",
        }) }} /></head>
        <body className={roboto.className + ' ' + SourceCodePro.variable}>
            <main><ApolloWrapper>
                {children}
            </ApolloWrapper></main>
        </body>
    </html>;
}
