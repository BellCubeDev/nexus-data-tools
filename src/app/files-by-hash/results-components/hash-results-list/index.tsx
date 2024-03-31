import type { SearchForFileRes } from "../../input-processing";
import styles from './hash-results-list.module.scss';
import { SingleFileDisplay } from "../single-file";
import { VariablePlate } from "../variable-plate";
import type { FileHashData } from "../single-file/file";

function getLikelyResults(file: File, nexusData: FileHashData[]): NonNullable<SearchForFileRes['data']['fileHashes']> {
    let filtered = nexusData;
    let considerEverythingUnlikelyIfNotFiltered = false;

    const bySize = filtered.filter(data => parseInt(data.fileSize) === file.size);
    if (bySize.length === 1 || bySize.length === 0) return bySize;

    const byName = filtered.filter(data => data.fileName === file.name);
    if (byName.length === 1) return byName;
    if (byName.length === 0) considerEverythingUnlikelyIfNotFiltered = true;
    else filtered = byName;

    const nameIncludesModID = filtered.filter(data => data.modFile && file.name.includes(`-${data.modFile.mod.modId}-`));
    if (nameIncludesModID.length === 1) return nameIncludesModID;
    if (nameIncludesModID.length === 0) considerEverythingUnlikelyIfNotFiltered = true;
    else filtered = nameIncludesModID;

    if (considerEverythingUnlikelyIfNotFiltered && filtered.length === nexusData.length) return [];
    return filtered;
}

function getItemsNotInOtherArray<TFrom, TExclude>(from: TFrom[], exclude: TExclude[]): Exclude<TFrom, TExclude>[] {
    return from.filter(item => !exclude.includes(item as any)) as any;
}

export function ResultsForHashList({hash, file, nexusData}: {hash: string, file: File, nexusData: FileHashData[]}) {
    const likelyResults = getLikelyResults(file, nexusData);
    const otherResults = getItemsNotInOtherArray(nexusData, likelyResults);

    return <div className={styles.results_list}>
        <h2>Results for <VariablePlate value={file.name} level={1} /></h2>
        <p>MD5 Hash: <VariablePlate value={hash} level={2} /></p>
        {likelyResults.length ? <div className={styles.results_list_likely}>
            <h3>Likely Result{likelyResults.length === 1 ? '' : 's'}</h3>
            <div className={styles.results_list_content}>
                {likelyResults.map((data, i) => <SingleFileDisplay key={i} data={data} />)}
            </div>
        </div> : null}
        {otherResults.length ? <div className={styles.results_list_other}>
            <h3>Unlikely Result{otherResults.length === 1 ? '' : 's'}</h3>
            <div className={styles.results_list_content}>
                {otherResults.map((data, i) => <SingleFileDisplay key={i} data={data} />)}
            </div>
        </div> : null}
        { !likelyResults.length && !otherResults.length && <p>No matches.</p>}
    </div>;
}
