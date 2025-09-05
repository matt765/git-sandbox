"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useGitStore } from "@/store/gitStore";

export const useCommandHistory = (onSubmit: (value: string) => void) => {
  const [value, setValue] = useState("");

  // --- FIX START ---
  // Select each piece of state individually to prevent re-creating an object on every render.
  const commandHistory = useGitStore((state) => state.commandHistory);
  const addCommandToHistory = useGitStore((state) => state.addCommandToHistory);
  // --- FIX END ---

  const historyIndex = useRef(-1);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const isHistoryNav = e.key === "ArrowUp" || e.key === "ArrowDown";

    if (isHistoryNav && commandHistory.length > 0) {
      e.preventDefault();

      if (e.key === "ArrowUp") {
        historyIndex.current = Math.min(
          historyIndex.current + 1,
          commandHistory.length - 1
        );
      } else {
        // ArrowDown
        historyIndex.current = Math.max(historyIndex.current - 1, -1);
      }

      const historyValue =
        historyIndex.current >= 0 ? commandHistory[historyIndex.current] : "";
      setValue(historyValue);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) {
        addCommandToHistory(value);
        onSubmit(value);
        setValue("");
        historyIndex.current = -1;
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    // Reset history navigation if user starts typing
    historyIndex.current = -1;
  };

  return {
    value,
    setValue,
    handleKeyDown,
    handleChange,
  };
};
