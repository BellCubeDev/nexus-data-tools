import styles from './single-file.module.scss';
import { VariablePlate } from '../variable-plate';
import { GameDisplay } from './game';
import { ModDisplay } from './mod';
import { FileDisplay, type FileHashData } from './file';

export function SingleFileDisplay({data}: { data: FileHashData, }) {

    return <details className={styles.singleFileCard}>

        <summary>
            <VariablePlate value={data.fileName} level={5} />
            for mod
            <VariablePlate value={data.modFile?.mod.name} level={7} />
            by
            <VariablePlate value={data.modFile?.mod.uploader.name} level={8} />
        </summary>

        <div className={styles.singleFileDisplay}>
            <FileDisplay data={data} />
            {data.modFile && <>
                <ModDisplay mod={data.modFile.mod} />
                <GameDisplay game={data.modFile?.game} />
                <DownloadLinks modFile={data.modFile} />
            </>}
        </div>

    </details>;
}

function DownloadLinks({modFile}: { modFile: NonNullable<FileHashData['modFile']> }) {
    const base = `https://www.nexusmods.com/${modFile.game.domainName}/mods/${modFile.mod.modId}?tab=files&file_id=${modFile.fileId}`;
    return <div className={styles.downloadLinksWrapper}>
        <h3>Download Links</h3>
        <dl className={styles.downloadLinks}>
            <div>
                <dt>Manual Download</dt>
                <dd><code><a href={base} target="_blank" rel="noreferrer">{base}</a></code></dd>
            </div>
            <div>
                <dt>Mod Manager Download</dt>
                <dd><code><a href={base + '&nmm=1'} target="_blank" rel="noreferrer">{base + '&nmm=1'}</a></code></dd>
            </div>
        </dl>
    </div>;
}
