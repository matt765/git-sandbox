// src/components/views/homepage/parts/advancedButtons/modals/DeleteBranchModal.tsx
import { useState, useMemo } from "react";
import { useGitStore } from "@/store/gitStore";
import { ContainedButton } from "@/components/common/ContainedButton";
import styles from "./common.module.css";

interface DeleteBranchModalProps {
  onClose: () => void;
}

export const DeleteBranchModal = ({ onClose }: DeleteBranchModalProps) => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const branches = useGitStore((state) => state.branches);
  const currentBranch = useGitStore((state) => state.HEAD.name);
  const deleteBranch = useGitStore((state) => state.deleteBranch);

  const availableBranches = useMemo(() => 
    Object.keys(branches).filter(branchName => branchName !== currentBranch), [branches, currentBranch]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBranch) {
      deleteBranch(selectedBranch);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.label}>
        Select branch to delete
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className={styles.select}
          required
        >
          <option value="" disabled>
            Choose a branch...
          </option>
          {availableBranches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </label>
      {availableBranches.length === 0 && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No branches available to delete (cannot delete current branch)
        </p>
      )}
      <div className={styles.actions}>
        <ContainedButton 
          type="submit" 
          disabled={!selectedBranch || availableBranches.length === 0}
        >
          Delete Branch
        </ContainedButton>
      </div>
    </form>
  );
};
