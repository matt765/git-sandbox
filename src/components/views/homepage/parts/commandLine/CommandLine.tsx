import { useState, useRef } from "react";
import { useGitStore } from "@/store/gitStore";
import { TerminalIcon } from "@/assets/icons/TerminalIcon";
import { useCommandHistory } from "@/hooks/useCommandHistory";
import styles from "./CommandLine.module.css";
import { ArrowRightSimpleIcon } from "@/assets/icons/ArrowRightSimpleIcon";

export const CommandLine = () => {
  const [error, setError] = useState<string | null>(null);

  const executeCommand = useGitStore((state) => state.executeCommand);
  const openTerminal = useGitStore((state) => state.openTerminal);

  const timeoutRef = useRef<number | null>(null);

  const handleSubmit = (command: string) => {
    const result = executeCommand(command);
    if (!result.success) {
      setError(result.message);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setError(null), 3000);
    } else {
      setError(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  };

  const { value, setValue, handleKeyDown, handleChange } =
    useCommandHistory(handleSubmit);

  return (
    <div className={styles.container}>
      <span className={styles.prompt}><ArrowRightSimpleIcon /></span>
      <input
        className={styles.input}
        placeholder="Enter a command..."
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <div
        className={styles.terminalIcon}
        onClick={openTerminal}
        title="Open interactive terminal"
      >
        <TerminalIcon />
      </div>
      {error && (
        <div
          className={`${styles.tooltip} ${error ? styles.tooltipVisible : ""}`}
        >
          {error}
        </div>
      )}
    </div>
  );
};
