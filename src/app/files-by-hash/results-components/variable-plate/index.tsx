import styles from './variable-plate.module.scss';

const colorCount = 8;

export function VariablePlate({value, level}: {value: React.ReactNode, level: number}) {
    level ||= 1;
    level = level % colorCount;
    return <span className={`${styles.variable} ${styles['variable--' + level]}`}>{value}</span>;
}
