import styles from "./LogHistory.module.css";
import { SectionTitle } from "@/components/common/SectionTitle";

const mockLogs = [
  "Initialized Git repository.",
  'Created commit a1b2c3d: "Initial commit"',
  "Switched to a new branch 'feature/login'",
  'Created commit f4g5h6i: "Add login form"',
];

export const LogHistory = () => {
  return (
    <div className={styles.container}>
      <SectionTitle>History</SectionTitle>
      <div className={styles.logsContainer}>
        {mockLogs.map((log, index) => (
          <p key={index} className={styles.logEntry}>
            {log}
          </p>
        ))}
      </div>
    </div>
  );
};
