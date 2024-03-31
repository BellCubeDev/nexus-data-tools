import { UploaderDisplay, uploaderFields } from "./uploader";
import styles from './mod.module.scss';
import type { GetOutput, Mod } from "@/nexus-api/GraphQL";

export function modFields(mod: Mod) {
    const fields = [
        mod.modId,
        mod.name,
        mod.status,
        mod.summary,
        mod.uploader(uploaderFields),
        mod.author,
        mod.version,
        mod.thumbnailUrl,
    ] as const;
    return fields as [...typeof fields];
}

export type ModData = GetOutput<ReturnType<typeof modFields>>;

export function ModDisplay({mod}: {mod: ModData}) {
    return <div className={styles.modDisplayWrapper}>
        <h3>Mod Information</h3>
        <dl>
            <div className={styles.modBannerAndNameWithIdAndLatestVersionCombo}>
                <div className={styles.modBanner}>
                    <dt>Mod Banner</dt>
                    <dd><img src={mod.thumbnailUrl || 'https://next.nexusmods.com/assets/images/default/cover_empty.png'} alt="banner image for the mod" /></dd> {/* Memeable alt text, I know */}
                </div>
                <div className={styles.modNameAndIdCombo}>
                    <div className={styles.modName}>
                        <dt>Mod Name</dt>
                        <dd><h4>{mod.name}</h4></dd>
                    </div>
                    <div className={styles.modId}>
                        <dt>Mod ID</dt>
                        <dd>{mod.modId}</dd>
                    </div>
                </div>
                <div className={styles.modLatestVersion}>
                    <dt>Latest Version:</dt>
                    <dd><code>{mod.version}</code></dd>
                </div>
            </div>
            <div className={styles.modSummary}>
                <dt><h5>Mod Summary</h5></dt>
                <dd>{mod.summary}</dd>
            </div>
            <UploaderDisplay uploader={mod.uploader} authorName={mod.author} />
        </dl>
    </div>;
}
