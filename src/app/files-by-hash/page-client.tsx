'use client';

import { useApolloClient } from "@apollo/client";
import { useActionState, useMemo, useState } from "react";
import { searchForFile } from "./input-processing";

import styles from './page.module.scss';
import resultStyles from './results.module.scss';
import { FileInputForm } from "./page-file-input-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export function NexusFileFinderClientUI(){
    const client = useApolloClient();
    const [infoState, setInfoState] = useState<React.ReactNode>(<div className={resultStyles.infoText}>
        <FontAwesomeIcon icon={faInfoCircle} />
        <span>Submit a file (or multiple files!) to search for them in the Nexus API.</span>
    </div>);
    const searchForFileBound = useMemo(() => searchForFile.bind(null, client, setInfoState), [client, setInfoState]);
    const [result, formAction] = useActionState(searchForFileBound, null);

    return <div className={styles.page}>
        {infoState}
        <FileInputForm formAction={formAction} />
        <div className={styles.results}>
            {result}
        </div>
    </div>;
};
