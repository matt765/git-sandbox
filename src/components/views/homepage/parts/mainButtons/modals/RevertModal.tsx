// src/components/views/HomepageView/parts/mainButtons/modals/RevertModal.tsx
import { useState, useMemo } from "react";
import { useGitStore } from "@/store/gitStore";
import { ContainedButton } from "@/components/common/ContainedButton";
import styles from "./common.module.css";

interface RevertModalProps {
  onClose: () => void;
}

export const RevertModal = ({ onClose }: RevertModalProps) => {
  const [selectedCommit, setSelectedCommit] = useState("");
  const commitsRecord = useGitStore((state) => state.commits);
  const revert = useGitStore((state) => state.revert);
  
  const commits = useMemo(() => Object.values(commitsRecord), [commitsRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCommit) {
      revert(selectedCommit);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.label}>
        Select commit to revert
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
          Revert
        </ContainedButton>
      </div>
    </form>
  );
};
