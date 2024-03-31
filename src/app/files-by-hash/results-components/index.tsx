import type { SearchForFileRes } from "../input-processing";
import { ResultsForHashList } from "./hash-results-list";
import styles from '../results.module.scss';
import './format-dd.scss';
import type { FileHashData } from "./single-file/file";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChampagneGlasses, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";


export function SearchForFileResultComponent({res, hashMap, setInfoState}: {res: SearchForFileRes, hashMap: Map<string, File>, setInfoState: (newInfoState: React.ReactNode) => void}) {
    if (res.error) return <>
        <p>Failed to search for files:</p>
        <pre><code>
            {res.error.stack}
        </code></pre>
        Surviving Data:
        <pre><code>
            {JSON.stringify(res.data, null, 4)}
        </code></pre>
    </>;

    const fileCount = res.data.fileHashes?.length ?? 0;
    const errorCount = res.errors?.length ?? 0;

    const fileDataByHash: Record<string, {
        file: File,
        nexusData: FileHashData[],
    }> = {};

    for (const [hash, file] of hashMap.entries()) {
        fileDataByHash[hash] = {file, nexusData: []};
    }

    for (const nexusData of res.data.fileHashes ?? []) {
        const dataByHashObj = fileDataByHash[nexusData.md5];
        if (!dataByHashObj) {
            console.warn(`Nexus returned data for file with hash ${nexusData.md5}, but we didn't have a file with that MD5!`);
            continue;
        }

        dataByHashObj.nexusData.push(nexusData);
    }

    setInfoState(<div className={`${styles.infoText} ${errorCount ? styles.warn : ''}`}>
        <FontAwesomeIcon icon={errorCount ? faTriangleExclamation : faChampagneGlasses} />
        <span>Found {
            fileCount ? fileCount : "no"
        } file{fileCount === 1 ? "" : "s"}{
            errorCount ? ` and encountered ${errorCount} error${errorCount === 1 ? "" : "s"}` : ""
        }</span>
    </div>);

    return <div className={styles.results}>

        {Object.entries(fileDataByHash)
            .sort(([,{file: fileA}], [,{file: fileB}]) => fileA.name.localeCompare(fileB.name))
            .map(([hash, {file, nexusData}], i) => <ResultsForHashList key={i} hash={hash} file={file} nexusData={nexusData} />)
        }

        {res.errors && <div className={styles.results_errors}>
            {res.errors.map((e, i) => <div className={`${styles.infoText} ${styles.error}`} key={i}>
                <FontAwesomeIcon icon={faTriangleExclamation} />
                <span>Got errors while searching for files. Error #{i}:</span>
                <br />
                <pre><code>
                    {e.stack}
                </code></pre>
            </div>)}
        </div>}
    </div>;
}
