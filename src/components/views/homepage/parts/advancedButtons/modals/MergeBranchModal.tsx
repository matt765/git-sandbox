// src/components/views/homepage/parts/advancedButtons/modals/MergeBranchModal.tsx
import { useState, useMemo } from "react";
import { useGitStore } from "@/store/gitStore";
import { ContainedButton } from "@/components/common/ContainedButton";
import styles from "./common.module.css";

interface MergeBranchModalProps {
  onClose: () => void;
}

export const MergeBranchModal = ({ onClose }: MergeBranchModalProps) => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const branches = useGitStore((state) => state.branches);
  const currentBranch = useGitStore((state) => state.HEAD.name);
  const merge = useGitStore((state) => state.merge);

  const availableBranches = useMemo(() => 
    Object.keys(branches).filter(branchName => branchName !== currentBranch), [branches, currentBranch]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBranch) {
      merge(selectedBranch);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.label}>
        Select branch to merge into current branch ({currentBranch})
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className={styles.select}
          required
        >
          <option value="" disabled>
            Choose a branch...
          </option>
          {availableBranches.map((branchName) => (
            <option key={branchName} value={branchName}>
              {branchName}
            </option>
          ))}
        </select>
      </label>
      {availableBranches.length === 0 && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No other branches available to merge
        </p>
      )}
      <div className={styles.actions}>
        <ContainedButton 
          type="submit" 
          disabled={!selectedBranch || availableBranches.length === 0}
        >
          Merge Branch
        </ContainedButton>
      </div>
    </form>
  );
};
