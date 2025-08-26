import styles from "./CommandLine.module.css";

export const CommandLine = () => {
  return (
    <div className={styles.container}>
      <span className={styles.prompt}>$</span>
      <input className={styles.input} placeholder="Wpisz komendę..." />
    </div>
  );
};
