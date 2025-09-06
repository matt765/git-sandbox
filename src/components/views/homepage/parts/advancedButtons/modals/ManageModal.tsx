import { Select } from "@/components/common/Select";
import { useGitStore } from "@/store/gitStore";
import styles from "./common.module.css";

interface ManageModalProps {
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  action: "create" | "delete" | "rename";
  setAction: (action: "create" | "delete" | "rename") => void;
  newBranchName: string;
  setNewBranchName: (name: string) => void;
  renameBranchName: string;
  setRenameBranchName: (name: string) => void;
}

export const ManageModal = ({ 
  selectedBranch, 
  setSelectedBranch, 
  action, 
  setAction,
  newBranchName,
  setNewBranchName,
  renameBranchName,
  setRenameBranchName
}: ManageModalProps) => {
  const branches = useGitStore((state) => state.branches);
  const currentBranch = useGitStore((state) => state.HEAD.name);

  const branchOptions = Object.keys(branches)
    .filter(name => action === "delete" ? name !== currentBranch : true)
    .map(name => ({ value: name, label: name }));

  const actionOptions = [
    { value: "create", label: "Create branch" },
    { value: "delete", label: "Delete branch" },
    { value: "rename", label: "Rename branch" },
  ];

  return (
    <div className={styles.form}>
      <label className={styles.label}>
        Action:
        <Select
          value={action}
          onChange={(value) => setAction(value as "create" | "delete" | "rename")}
          options={actionOptions}
          placeholder="Select action"
        />
      </label>

      {action === "create" && (
        <label className={styles.label}>
          New branch name:
          <input
            type="text"
            value={newBranchName}
            onChange={(e) => {
              console.log("Input value changed:", e.target.value);
              setNewBranchName(e.target.value);
            }}
            placeholder="Enter branch name"
            className={styles.input}
            maxLength={20}
          />
        </label>
      )}

      {action === "delete" && (
        <label className={styles.label}>
          Branch to delete:
          <Select
            value={selectedBranch}
            onChange={setSelectedBranch}
            options={branchOptions}
            placeholder="Select branch to delete"
          />
        </label>
      )}

      {action === "rename" && (
        <>
          <label className={styles.label}>
            Branch to rename:
            <Select
              value={selectedBranch}
              onChange={setSelectedBranch}
              options={branchOptions}
              placeholder="Select branch to rename"
            />
          </label>
          <label className={styles.label}>
            New name:
            <input
              type="text"
              value={renameBranchName}
              onChange={(e) => setRenameBranchName(e.target.value)}
              placeholder="Enter new branch name"
              className={styles.input}
              maxLength={20}
            />
          </label>
        </>
      )}
    </div>
  );
};
