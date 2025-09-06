// src/components/views/homepage/parts/advancedButtons/modals/SwitchBranchModal.tsx
import { useMemo } from "react";
import { useGitStore } from "@/store/gitStore";
import { Select } from "@/components/common/Select";
import styles from "./common.module.css";

interface SwitchBranchModalProps {
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
}

export const SwitchBranchModal = ({ selectedBranch, setSelectedBranch }: SwitchBranchModalProps) => {
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
        Branch to switch to:
        <Select
          value={selectedBranch}
          onChange={setSelectedBranch}
          options={branchOptions}
          placeholder="Select branch"
        />
      </label>
    </div>
  );
};
