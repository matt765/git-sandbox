// src/components/views/homepage/parts/console/Console.tsx
import styles from "./Console.module.css";

export const Console = () => {
  return (
    <div className={styles.container}>
      <p className={styles.title}>Wyjaśnienia</p>
      <span className={styles.subtitle}>(opis + komenda)</span>
    </div>
  );
};
