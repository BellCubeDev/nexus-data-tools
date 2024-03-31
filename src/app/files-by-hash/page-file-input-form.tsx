'use client';

import { useMemo, useRef, useState } from 'react';
import styles from './page.module.scss';
import { filesize } from 'filesize';

export function FileInputForm({formAction}: {formAction: (payload: FormData) => void}) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [files, setFiles] = useState<File[]>([]);

    return <form className={styles.fileInput}>
        <input ref={inputRef} type="file" name="fileCollector" multiple hidden onChange={e => {
            if (!e.target.files) return setFiles([]);
            setFiles(
                Array.from(e.target.files)
                .filter(file => file.size > 0)
                .sort((fA, fB) => fA.name.localeCompare(fB.name))
            );
        }} />

        {files.length > 0 && <details className={styles.fileListDetailsBlock}>
            <summary className={styles.fileListSummary}>
                <span>{files.length} Files</span>
                <span className={styles.fileSize}>{filesize(files.reduce((acc, file) => acc + file.size, 0), {base: 2, round: 2})}</span>
            </summary>

            <div className={styles.fileList}>
                {files.map((file, i) => <div key={i} className={styles.fileItem}>
                    <span>{file.name}</span>
                    <span className={styles.fileSize}>{filesize(file.size, {base: 2, round: 2})}</span>
                </div>)}
            </div>
        </details>}


        <button type='button' onClick={() => inputRef.current?.click()} className={`${styles.button} ${styles.selectButton}`}>{files.length ? 'Change Selection' : 'Select Files'}</button>
        <button type="submit" formAction={formAction} className={`${styles.button} ${styles.submitButton}`} disabled={files.length === 0}>Get File Info</button>
    </form>;
}
