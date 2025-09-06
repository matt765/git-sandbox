// src/components/views/homepage/parts/advancedButtons/modals/MergeBranchModal.tsx
import { useMemo } from "react";
import { useGitStore } from "@/store/gitStore";
import { Select } from "@/components/common/Select";
import styles from "./common.module.css";

interface MergeBranchModalProps {
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
}

export const MergeBranchModal = ({ selectedBranch, setSelectedBranch }: MergeBranchModalProps) => {
  const branches = useGitStore((state) => state.branches);
  const currentBranch = useGitStore((state) => state.HEAD.name);

  const branchOptions = useMemo(() => 
    Object.keys(branches)
      .filter(branchName => branchName !== currentBranch)
      .map(name => ({ value: name, label: name })),
    [branches, currentBranch]
  );

  return (
    <div className={styles.form}>
      <label className={styles.label}>
        Branch to merge into current branch ({currentBranch}):
        <Select
          value={selectedBranch}
          onChange={setSelectedBranch}
          options={branchOptions}
          placeholder="Select branch to merge"
        />
      </label>
    </div>
  );
};
