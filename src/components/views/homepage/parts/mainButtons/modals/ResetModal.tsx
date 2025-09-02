// src/components/views/HomepageView/parts/mainButtons/modals/ResetModal.tsx
import { useState, useMemo } from "react";
import { useGitStore } from "@/store/gitStore";
import { ContainedButton } from "@/components/common/ContainedButton";
import styles from "./common.module.css";

type ResetMode = "soft" | "mixed" | "hard";

interface ResetModalProps {
  onClose: () => void;
}

export const ResetModal = ({ onClose }: ResetModalProps) => {
  const [selectedCommit, setSelectedCommit] = useState("");
  const [mode, setMode] = useState<ResetMode>("mixed");
  const commitsRecord = useGitStore((state) => state.commits);
  const reset = useGitStore((state) => state.reset);
  
  const commits = useMemo(() => Object.values(commitsRecord), [commitsRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCommit) {
      reset(selectedCommit, mode);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.label}>
        Reset current branch to commit
        <select
          value={selectedCommit}
          onChange={(e) => setSelectedCommit(e.target.value)}
          className={styles.select}
          required
        >
          <option value="" disabled>
            Choose a commit...
          </option>
          {commits.map((commit) => (
            <option key={commit.id} value={commit.id}>
              {commit.id} - {commit.message}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.label}>
        Reset mode
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <div className={styles.radioOption}>
              <input
                type="radio"
                name="mode"
                value="soft"
                checked={mode === "soft"}
                onChange={() => setMode("soft")}
              />
              Soft
            </div>
            <p className={styles.description}>
              HEAD is moved, files are kept in staging.
            </p>
          </label>
          <label className={styles.radioLabel}>
            <div className={styles.radioOption}>
              <input
                type="radio"
                name="mode"
                value="mixed"
                checked={mode === "mixed"}
                onChange={() => setMode("mixed")}
              />
              Mixed
            </div>
            <p className={styles.description}>
              HEAD is moved, staging is reset.
            </p>
          </label>
          <label className={styles.radioLabel}>
            <div className={styles.radioOption}>
              <input
                type="radio"
                name="mode"
                value="hard"
                checked={mode === "hard"}
                onChange={() => setMode("hard")}
              />
              Hard
            </div>
            <p className={styles.description}>
              HEAD is moved, staging & working directory are reset. (Potentially
              destructive)
            </p>
          </label>
        </div>
      </div>

      <div className={styles.actions}>
        <ContainedButton type="submit" disabled={!selectedCommit}>
          Reset
        </ContainedButton>
      </div>
    </form>
  );
};
