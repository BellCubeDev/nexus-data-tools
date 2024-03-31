import styles from './game.module.scss';
import type { Game, GetOutput } from "@/nexus-api/GraphQL";

export function gameFields(game: Game) {
    const fields = [
        game.domainName,
        game.id,
        game.name,
        game.tileImageUrl,
    ] as const;
    return fields as [...typeof fields];
}

export type GameData = GetOutput<ReturnType<typeof gameFields>>;

export function GameDisplay({game}: {game: GameData}) {
    return <div className={styles.gameDisplay}>
        <h3>Game</h3>
        <dl className={styles.gameInfo}>
            <div className={styles.gameName}>
                <dt>Game Name</dt>
                <dd>{game.name}</dd>
            </div>
            {game.tileImageUrl &&  <div className={styles.gamePoster}>
                <dt>Game Poster</dt>
                <dd><img src={game.tileImageUrl} alt="poster image for the game" /></dd> {/* Memeable alt text, I know */}
            </div>}
            <div className={styles.gameDomainAndIdCombo}>
                <div className={styles.gameDomainName}>
                    <dt>Game Domain Name</dt>
                    <dd>{game.domainName}</dd>
                </div>
                <div className={styles.gameId}>
                    <dt>Game ID</dt>
                    <dd>{game.id}</dd>
                </div>
            </div>
        </dl>
    </div>;
}
