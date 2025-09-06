// src/components/views/HomepageView/parts/mainButtons/modals/ResetModal.tsx
import { useMemo } from "react";
import { useGitStore } from "@/store/gitStore";
import { Select } from "@/components/common/Select";
import styles from "./common.module.css";

export type ResetMode = "soft" | "mixed" | "hard";

interface ResetModalProps {
  selectedCommit: string;
  setSelectedCommit: (commit: string) => void;
  mode: ResetMode;
  setMode: (mode: ResetMode) => void;
}

export const ResetModal = ({ selectedCommit, setSelectedCommit, mode, setMode }: ResetModalProps) => {
  const commitsRecord = useGitStore((state) => state.commits);
  
  const commits = useMemo(() => Object.values(commitsRecord), [commitsRecord]);
  
  const commitOptions = useMemo(() => 
    commits.map(commit => ({
      value: commit.id,
      label: `${commit.id} - ${commit.message}`
    })), [commits]
  );

  return (
    <div className={styles.form}>
      <label className={styles.label}>
        Reset current branch to commit
        <Select
          value={selectedCommit}
          onChange={setSelectedCommit}
          options={commitOptions}
          placeholder="Choose a commit..."
        />
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
    </div>
  );
};
