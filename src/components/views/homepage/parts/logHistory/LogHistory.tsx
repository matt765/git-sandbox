// src/components/views/HomepageView/parts/logHistory/LogHistory.tsx
import { useEffect, useRef } from "react";
import { useGitStore } from "@/store/gitStore";
import { SectionTitle } from "@/components/common/SectionTitle";
import styles from "./LogHistory.module.css";

export const LogHistory = () => {
  const logs = useGitStore((state) => state.logs);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className={styles.container}>
      <SectionTitle>History</SectionTitle>
      <div className={styles.logsContainer}>
        {logs.map((log, index) => (
          <p key={index} className={styles.logEntry}>
            {log}
          </p>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};
