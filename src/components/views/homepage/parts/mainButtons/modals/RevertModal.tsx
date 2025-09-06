// src/components/views/HomepageView/parts/mainButtons/modals/RevertModal.tsx
import { useMemo } from "react";
import { useGitStore } from "@/store/gitStore";
import { Select } from "@/components/common/Select";
import styles from "./common.module.css";

interface RevertModalProps {
  selectedCommit: string;
  setSelectedCommit: (commit: string) => void;
}

export const RevertModal = ({ selectedCommit, setSelectedCommit }: RevertModalProps) => {
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
        Select commit to revert
        <Select
          value={selectedCommit}
          onChange={setSelectedCommit}
          options={commitOptions}
          placeholder="Choose a commit..."
        />
      </label>
    </div>
  );
};
