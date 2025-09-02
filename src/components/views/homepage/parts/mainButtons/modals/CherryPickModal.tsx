// src/components/views/HomepageView/parts/mainButtons/modals/CherryPickModal.tsx
import { useState, useMemo } from "react";
import { Commit, useGitStore } from "@/store/gitStore";
import { ContainedButton } from "@/components/common/ContainedButton";
import styles from "./common.module.css";

interface CherryPickModalProps {
  onClose: () => void;
}

export const CherryPickModal = ({ onClose }: CherryPickModalProps) => {
  const [selectedCommit, setSelectedCommit] = useState("");
  const commitsRecord = useGitStore((state) => state.commits);
  const cherryPick = useGitStore((state) => state.cherryPick);
  
  const commits = useMemo(() => Object.values(commitsRecord), [commitsRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCommit) {
      cherryPick(selectedCommit);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.label}>
        Select commit to cherry-pick
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
      <div className={styles.actions}>
        <ContainedButton type="submit" disabled={!selectedCommit}>
          Cherry-pick
        </ContainedButton>
      </div>
    </form>
  );
};
