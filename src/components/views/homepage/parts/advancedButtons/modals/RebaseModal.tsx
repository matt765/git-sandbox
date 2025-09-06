import { Select } from "@/components/common/Select";
import { useGitStore } from "@/store/gitStore";
import styles from "./common.module.css";

interface RebaseModalProps {
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
}

export const RebaseModal = ({ selectedBranch, setSelectedBranch }: RebaseModalProps) => {
  const branches = useGitStore((state) => state.branches);
  const currentBranch = useGitStore((state) => state.HEAD.name);

  const branchOptions = Object.keys(branches)
    .filter(name => name !== currentBranch)
    .map(name => ({ value: name, label: name }));

  return (
    <div className={styles.form}>
      <label className={styles.label}>
        Target branch to rebase onto:
        <Select
          value={selectedBranch}
          onChange={setSelectedBranch}
          options={branchOptions}
          placeholder="Select target branch"
        />
      </label>
    </div>
  );
};
