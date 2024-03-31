import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: {
        absolute: "Nexus Data Tools",
    }
};

export default function RedirectToFilesByHashPage() {
    redirect('/files-by-hash');
}
