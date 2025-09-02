// src/components/views/HomepageView/parts/logHistory/LogHistory.tsx
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useGitStore } from "@/store/gitStore";
import { SectionTitle } from "@/components/common/SectionTitle";
import styles from "./LogHistory.module.css";

export const LogHistory = () => {
  const logs = useGitStore((state) => state.logs);
  const logsContainerRef = useRef<HTMLDivElement | null>(null);
  const [animatingNewLogs, setAnimatingNewLogs] = useState(false);
  const [newLogsCount, setNewLogsCount] = useState(0);
  const previousLogsLength = useRef(logs.length);

  // Liczba nowych logów (fade-in)
  useEffect(() => {
    if (logs.length > previousLogsLength.current) {
      setNewLogsCount(logs.length - previousLogsLength.current);
      setAnimatingNewLogs(true);
      const timeout = setTimeout(() => {
        setAnimatingNewLogs(false);
        setNewLogsCount(0);
      }, 800);
      previousLogsLength.current = logs.length;
      return () => clearTimeout(timeout);
    }
    previousLogsLength.current = logs.length;
  }, [logs.length]);

  // --- FLIP animation for shifting existing log entries downward ---
  const previousPositionsRef = useRef<Map<string, DOMRect>>(new Map());
  const previousCountRef = useRef(logs.length);

  useLayoutEffect(() => {
    const container = logsContainerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    const newPositions = new Map<string, DOMRect>();
    children.forEach((el) => {
      const k = el.dataset.key;
      if (k) newPositions.set(k, el.getBoundingClientRect());
    });

    // Animuj tylko gdy liczba logów wzrosła
    if (logs.length > previousCountRef.current && previousPositionsRef.current.size) {
      children.forEach((el) => {
        const key = el.dataset.key;
        if (!key) return;
        const prevBox = previousPositionsRef.current.get(key);
        const newBox = newPositions.get(key);
        if (!prevBox || !newBox) return;
        const dx = prevBox.left - newBox.left;
        const dy = prevBox.top - newBox.top;
        if (dx !== 0 || dy !== 0) {
          // Web Animations API (lepsza kontrola, brak kolizji z CSS transitions)
            el.animate(
              [
                { transform: `translate(${dx}px, ${dy}px)` },
                { transform: "translate(0, 0)" },
              ],
              {
                duration: 400,
                easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              }
            );
        }
      });
    }

    previousPositionsRef.current = newPositions;
    previousCountRef.current = logs.length;
  }, [logs]);

  return (
    <div className={styles.container}>
      <SectionTitle>History</SectionTitle>
      <div className={styles.logsContainer} ref={logsContainerRef}>
    {logs.slice().reverse().map((log, index) => {
          const actualIndex = logs.length - 1 - index;
          const isNewLog = index < newLogsCount && animatingNewLogs;
          
          return (
            <p 
      key={`log-${actualIndex}-${log.slice(0, 20)}`}
      data-key={`log-${actualIndex}-${log.slice(0, 20)}`}
      className={`${styles.logEntry} ${isNewLog ? styles.newLogEntry : ''}`}
            >
              {log}
            </p>
          );
        })}
      </div>
    </div>
  );
};
