import { type ApolloClient, type ApolloQueryResult, type QueryOptions } from "@apollo/client";
import { SearchForFileResultComponent } from "../results-components";

import { query } from "@/nexus-api/GraphQL";
import { fileHashFields } from "../results-components/single-file/file";

import styles from '../results.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";

function getSearchByMD5Query(hashes: string[]) {
    return query(api => [
        api.fileHashes({md5s: hashes}, fileHashFields)
    ]);
}

export type SearchForFileRes = ApolloQueryResult<{query: ReturnType<typeof getSearchByMD5Query>} extends QueryOptions<any, infer T> ? T : never>

export async function searchForFile(client: ApolloClient<object>, setInfoState: (newInfoState: React.ReactNode) => void, lastState: React.ReactNode, formData: FormData): Promise<React.ReactNode> {
    const files = formData.getAll("fileCollector").map(file => {
        // @ts-ignore
        if (!(file instanceof File)) throw new Error(`Expected a File object; got ${typeof file}/${file.name}`);
        return file;
    }).filter(file => file.size > 0);


    const filesCount = files.length;
    if (files.length === 0) return <>
        <div className={styles.infoText}>
            <FontAwesomeIcon icon={faInfoCircle} />
            <span>No new files were submitted. Returning previous result.</span>
        </div>
        {lastState}
    </>;

    const hashMap = new Map<string, File>();
    const hashes: string[] = [];

    let setDoneHashing: ()=>void;
    const doneHashingPromise = new Promise<void>(resolve => {
        setDoneHashing = resolve;
    });

    let inUseThreadCount = 0;

    function updateFilesLoadingState() {
        setInfoState(<div className={styles.infoText}>
            <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
            <span>Hashed {hashes.length} of {filesCount} files ({files.length} queued, {inUseThreadCount} hashing now)</span>
        </div>);
    }

    requestAnimationFrame(() => updateFilesLoadingState() );

    function processFile(file: File) {
        console.log("Creating hash worker for file", file.name);

        const worker = new Worker(new URL("./hash.worker.ts", import.meta.url));
        inUseThreadCount++;
        updateFilesLoadingState();

        function processNextFile() {
            worker.terminate();
            inUseThreadCount--;
            updateFilesLoadingState();

            const nextFile = files.shift();
            if (nextFile) requestAnimationFrame(() => requestAnimationFrame(() => processFile(nextFile)));
            else if (inUseThreadCount === 0) setDoneHashing();
        }

        worker.onmessageerror = (event) => {
            console.error("Error while hashing file", file.name, event);
            processNextFile();
        };

        worker.onmessage = (event) => {
            console.log("Got hash", event.data, "for file", file.name);
            hashMap.set(event.data, file);
            hashes.push(event.data);
            processNextFile();
        };

        worker.postMessage(file);
    }

    for (let i = 0; i < navigator.hardwareConcurrency ?? 8; i++) {
        const file = files.shift();
        if (!file) break;
        processFile(file);
    }

    await doneHashingPromise;

    setInfoState(<div className={styles.infoText}>
        <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
        Hashed {hashes.length} files; asking Nexus nicely for files matching these hashes...
    </div>);

    let res: SearchForFileRes;
    try {
        res = await client.query({
            query: getSearchByMD5Query(hashes)
        });
    } catch (e) {
        if (e instanceof Error) {
            console.error("Error while searching for files", e);
            return <>
                <p>Failed to search for files (FATAL):</p>
                <pre><code>
                    {e.stack}
                </code></pre>
            </>;
        } else {
            throw e;
        }
    }

    console.log("Got search result", res)

    return <SearchForFileResultComponent res={res} hashMap={hashMap} setInfoState={setInfoState} />;
}
