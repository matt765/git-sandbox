import { useRef, useEffect, useState } from "react";
import { useGitStore } from "@/store/gitStore";
import type { TerminalLine } from "@/store/gitStore";
import { useCommandHistory } from "@/hooks/useCommandHistory";
import { SendIcon } from "@/assets/icons/SendIcon";
import { PaintbrushIcon } from "@/assets/icons/PaintbrushIcon";
import styles from "./TerminalWindow.module.css";

interface TerminalWindowProps {
  onClose: () => void;
}

export const TerminalWindow = ({ onClose }: TerminalWindowProps) => {
  const historyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const terminalHistory = useGitStore((state) => state.terminalHistory);
  const executeTerminalCommand = useGitStore(
    (state) => state.executeTerminalCommand
  );
  const clearTerminalHistory = useGitStore(
    (state) => state.clearTerminalHistory
  );

  const { value, setValue, handleKeyDown, handleChange } = useCommandHistory(
    executeTerminalCommand
  );

  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - 250,
    y: window.innerHeight / 2 - 150,
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleCommand = () => {
    if (value.trim()) {
      executeTerminalCommand(value);
      setValue("");
    }
  };

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const handleInputAreaClick = () => {
    inputRef.current?.focus();
  };

  const handleSendClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleCommand();
  };

  const handleClearClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    clearTerminalHistory();
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const onMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const renderLine = (line: TerminalLine, index: number) => {
    const key = `${index}-${line.content}`;
    switch (line.type) {
      case "input":
        return (
          <p key={key}>
            {" "}
            <span className={styles.prompt}>{">"}</span> {line.content}{" "}
          </p>
        );
      case "output":
        return (
          <p key={key} className={styles.output}>
            {" "}
            {line.content}{" "}
          </p>
        );
      case "error":
        return (
          <p key={key} className={styles.error}>
            {" "}
            {line.content}{" "}
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={styles.window}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        cursor: isDragging ? "grabbing" : "default",
      }}
    >
      <div className={styles.header} onMouseDown={onMouseDown}>
        <span className={styles.title}>Terminal</span>
        <button onClick={onClose} className={styles.closeButton}>
          {" "}
          &times;{" "}
        </button>
      </div>
      <div className={styles.body}>
        <div className={styles.history} ref={historyRef}>
          {terminalHistory.map(renderLine)}
        </div>
        <div className={styles.inputArea} onClick={handleInputAreaClick}>
          <div className={styles.commandLine}>
            <span className={styles.prompt}>{">"}</span>
            <input
              ref={inputRef}
              className={styles.input}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button
              onClick={handleClearClick}
              className={styles.iconButton}
              title="Clear terminal"
            >
              <PaintbrushIcon />
            </button>
            <button
              onClick={handleSendClick}
              className={styles.iconButton}
              title="Send command"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
