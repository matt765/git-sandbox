// src/components/views/homepage/parts/advancedButtons/modals/CreateBranchModal.tsx
import { useState } from "react";
import { useGitStore } from "@/store/gitStore";
import { ContainedButton } from "@/components/common/ContainedButton";
import styles from "./common.module.css";

interface CreateBranchModalProps {
  onClose: () => void;
}

export const CreateBranchModal = ({ onClose }: CreateBranchModalProps) => {
  const [branchName, setBranchName] = useState("");
  const createBranch = useGitStore((state) => state.createBranch);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (branchName.trim()) {
      createBranch(branchName.trim());
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.label}>
        Branch name
        <input
          type="text"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          className={styles.input}
          placeholder="feature/new-feature"
          required
          autoFocus
        />
      </label>
      <div className={styles.actions}>
        <ContainedButton type="submit" disabled={!branchName.trim()}>
          Create Branch
        </ContainedButton>
      </div>
    </form>
  );
};
