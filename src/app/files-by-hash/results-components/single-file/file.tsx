import { filesize } from "filesize";
import styles from './file.module.scss';
import { BBCode } from "../bbcode";
import type { FileHash, GetOutput } from "@/nexus-api/GraphQL";
import { gameFields } from "./game";
import { modFields } from "./mod";

export function fileHashFields(fileHash: FileHash) {
    const fields = [
        fileHash.createdAt,
        fileHash.fileName,
        fileHash.fileSize,
        fileHash.gameId,
        fileHash.md5,
        fileHash.modFile(modFile => [
            modFile.fileId,
            modFile.name,
            modFile.sizeInBytes,
            modFile.version,
            modFile.description,
            modFile.game(gameFields),
            modFile.mod(modFields),
        ])
    ] as const;
    return fields as [...typeof fields];
}

export type FileHashData = GetOutput<ReturnType<typeof fileHashFields>>;


export function FileDisplay({data}: { data: FileHashData }) {
    return <div className={styles.fileDisplay}>
        <h3>File Information</h3>
        <dl>
            <div className={styles.fileName}>
                <dt>File Name</dt>
                <dd>{data.fileName}</dd>
            </div>
            <div className={styles.fileSizeAndVersionCombo}>
                <div className={styles.fileSize}>
                    <dt>File Size</dt>
                    <dd>{filesize(parseInt(data.fileSize), {base: 2, round: 2})}</dd>
                </div>
                <div className={styles.fileVersion}>
                    <dt>File Version</dt>
                    <dd>{data.modFile?.version || ' '}</dd>
                </div>
            </div>
            <div className={styles.fileUploadTime}>
                <dt>File Upload Time</dt>
                <dd>{new Date(data.createdAt).toLocaleString(undefined, {
                    dateStyle: 'full',
                    timeStyle: 'medium',
                })}</dd>
            </div>
            <div className={styles.fileDescription}>
                <dt>File Description</dt>
                <dd><BBCode bbcode={data.modFile?.description || ' '} /></dd>
            </div>
        </dl>
    </div>;
}
