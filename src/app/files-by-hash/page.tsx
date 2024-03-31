import type { Metadata } from "next";
import { NexusFileFinderClientUI } from "./page-client";

export const runtime = 'nodejs';

export const metadata: Metadata = {
    title: 'Files by Hash',
    description: 'Hash files and search for those hashes in the Nexus Mods API.',
};

export default function NexusFileFindePage(){
    return <NexusFileFinderClientUI />;
};
