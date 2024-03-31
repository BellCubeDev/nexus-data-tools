import styles from './uploader.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import type { GetOutput, User } from "@/nexus-api/GraphQL";

export function uploaderFields(user: User) {
    const fields = [
        user.avatar,
        user.deleted,
        user.kudos,
        user.memberId,
        user.name,
    ] as const;
    return fields as [...typeof fields];
}

export type UploaderData = GetOutput<ReturnType<typeof uploaderFields>>;

export function UploaderDisplay({uploader, authorName}: {uploader: UploaderData, authorName: string | null | undefined}) {
    const isAuthorToo = !authorName || (uploader.name === authorName);

    console.log({
        uploader,
        authorName,
        isAuthorToo
    })

    return <div className={styles.uploaderDisplayWrapper}>
        <dt>
            <h3>Mod {isAuthorToo ? 'Author & ':''}Uploader</h3>
        </dt>
        <dd>
            <dl className={styles.uploaderDisplayInnerWrapper}>
                <div className={styles.avatarAndUsernameCombo}>
                    <div className={styles.uploaderAvatar}>
                        <dt>Uploader Avatar</dt>
                        <dd><img src={uploader.avatar} alt="an image" /></dd> {/* Memeable alt text, I know */}
                    </div>
                    <span className={styles.usernameAndIdCombo}>
                        <h4 className={styles.username}>
                            <dt>Uploader</dt>
                            <dd><a href={`https://nexusmods.com/users/${uploader.memberId}`}>{uploader.name}</a></dd>
                        </h4>
                        <span className={styles.memberId}>
                            <dt>Uploader User ID</dt>
                            <dd>{uploader.memberId}</dd>
                        </span>
                    </span>
                </div>
                <div className={styles.kudos}>
                    <dt>Kudos</dt>
                    <dd><FontAwesomeIcon icon={faHeart} /> {uploader.kudos}</dd>
                </div>
                <div className={styles.isDeleted}>
                    <dt>Deleted</dt>
                    <dd>{uploader.deleted ? 'Yes' : 'No'}</dd>
                </div>
            </dl>
        </dd>
        {!isAuthorToo && <>
            <dt>
                <h3>Mod Author(s)</h3>
            </dt>
            <h4 className={styles.username}>
                <dd>{authorName}</dd>
            </h4>
        </>}
    </div>;
}
