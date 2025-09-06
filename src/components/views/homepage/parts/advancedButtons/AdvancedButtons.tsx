// src/components/views/HomepageView/parts/advancedButtons/AdvancedButtons.tsx
import { useState } from "react";
import { SectionTitle } from "@/components/common/SectionTitle";
import { OutlinedButton } from "@/components/common/OutlinedButton";
import { useGitStore } from "@/store/gitStore";

import styles from "./AdvancedButtons.module.css";
import { MergeBranchModal } from "./modals/MergeBranchModal";
import { SwitchBranchModal } from "./modals/SwitchBranchModal";
import { RebaseModal } from "./modals/RebaseModal";
import { ManageModal } from "./modals/ManageModal";
import { ActionModal } from "@/components/common/ActionModal";

type ActiveModal = "merge" | "switch" | "rebase" | "manage" | null;

export const AdvancedButtons = () => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  
  // Stan dla merge
  const [mergeBranch, setMergeBranch] = useState("");
  
  // Stan dla switch
  const [switchBranchName, setSwitchBranchName] = useState("");
  
  // Stan dla rebase
  const [rebaseBranch, setRebaseBranch] = useState("");
  
  // Stan dla manage
  const [manageAction, setManageAction] = useState<"create" | "delete" | "rename">("create");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [newBranchName, setNewBranchName] = useState("");
  const [renameBranchName, setRenameBranchName] = useState("");

  // Store actions
  const merge = useGitStore((state) => state.merge);
  const switchBranch = useGitStore((state) => state.switchBranch);
  const rebase = useGitStore((state) => state.rebase);
  const createBranch = useGitStore((state) => state.createBranch);
  const deleteBranch = useGitStore((state) => state.deleteBranch);
  const renameBranch = useGitStore((state) => state.renameBranch);

  const closeModal = () => {
    setActiveModal(null);
    // Reset form states
    setMergeBranch("");
    setSwitchBranchName("");
    setRebaseBranch("");
    setManageAction("create");
    setSelectedBranch("");
    setNewBranchName("");
    setRenameBranchName("");
  };

  const handleManageCancel = () => {
    if (manageAction === "delete" || manageAction === "rename") {
      // Reset to create mode instead of closing modal
      setManageAction("create");
      setSelectedBranch("");
      setRenameBranchName("");
    } else {
      closeModal();
    }
  };

  const handleMerge = () => {
    if (mergeBranch) {
      merge(mergeBranch);
      closeModal();
    }
  };

  const handleSwitch = () => {
    if (switchBranchName) {
      switchBranch(switchBranchName);
      closeModal();
    }
  };

  const handleRebase = () => {
    if (rebaseBranch) {
      rebase(rebaseBranch);
      closeModal();
    }
  };

  const handleManage = () => {
    console.log("handleManage called with:", { manageAction, newBranchName, selectedBranch, renameBranchName });
    
    if (manageAction === "create" && newBranchName.trim()) {
      console.log("Creating branch:", newBranchName.trim());
      createBranch(newBranchName.trim());
      closeModal();
    } else if (manageAction === "delete" && selectedBranch) {
      console.log("Deleting branch:", selectedBranch);
      deleteBranch(selectedBranch);
      closeModal();
    } else if (manageAction === "rename" && selectedBranch && renameBranchName.trim()) {
      console.log("Renaming branch:", selectedBranch, "to:", renameBranchName.trim());
      renameBranch(selectedBranch, renameBranchName.trim());
      closeModal();
    } else {
      console.log("handleManage: conditions not met");
    }
  };

  const getManageAcceptText = () => {
    switch (manageAction) {
      case "create": return "Create Branch";
      case "delete": return "Yes, Delete";
      case "rename": return "Yes, Rename";
      default: return "Apply";
    }
  };

  const getManageCancelText = () => {
    switch (manageAction) {
      case "delete": return "No";
      case "rename": return "No";
      default: return "Cancel";
    }
  };

  const getManageDisabled = () => {
    const result = (() => {
      switch (manageAction) {
        case "create": return !newBranchName.trim();
        case "delete": return !selectedBranch;
        case "rename": return !selectedBranch || !renameBranchName.trim() || renameBranchName.trim() === selectedBranch;
        default: return true;
      }
    })();
    
    console.log("getManageDisabled:", { manageAction, newBranchName, selectedBranch, renameBranchName, result });
    return result;
  };

  return (
    <>
      <div className={styles.container}>
        <SectionTitle>Branches options</SectionTitle>
        <div className={styles.buttonsGrid}>
          <OutlinedButton onClick={() => setActiveModal("merge")}>
            Merge
          </OutlinedButton>
          <OutlinedButton onClick={() => setActiveModal("switch")}>
            Switch
          </OutlinedButton>
          <OutlinedButton onClick={() => setActiveModal("rebase")}>
            Rebase
          </OutlinedButton>
          <OutlinedButton onClick={() => setActiveModal("manage")}>
            Manage
          </OutlinedButton>
        </div>
      </div>

      <ActionModal
        isOpen={activeModal === "merge"}
        onClose={closeModal}
        title="Merge Branch"
        onAccept={handleMerge}
        acceptText="Merge"
        acceptDisabled={!mergeBranch}
      >
        <MergeBranchModal 
          selectedBranch={mergeBranch}
          setSelectedBranch={setMergeBranch}
        />
      </ActionModal>

      <ActionModal
        isOpen={activeModal === "switch"}
        onClose={closeModal}
        title="Switch Branch"
        onAccept={handleSwitch}
        acceptText="Switch"
        acceptDisabled={!switchBranchName}
      >
        <SwitchBranchModal 
          selectedBranch={switchBranchName}
          setSelectedBranch={setSwitchBranchName}
        />
      </ActionModal>

      <ActionModal
        isOpen={activeModal === "rebase"}
        onClose={closeModal}
        title="Rebase Branch"
        onAccept={handleRebase}
        acceptText="Rebase"
        acceptDisabled={!rebaseBranch}
      >
        <RebaseModal 
          selectedBranch={rebaseBranch}
          setSelectedBranch={setRebaseBranch}
        />
      </ActionModal>

      <ActionModal
        isOpen={activeModal === "manage"}
        onClose={handleManageCancel}
        title="Manage Branches"
        onAccept={handleManage}
        acceptText={getManageAcceptText()}
        acceptDisabled={getManageDisabled()}
        cancelText={getManageCancelText()}
      >
        <ManageModal 
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          action={manageAction}
          setAction={setManageAction}
          newBranchName={newBranchName}
          setNewBranchName={setNewBranchName}
          renameBranchName={renameBranchName}
          setRenameBranchName={setRenameBranchName}
        />
      </ActionModal>
    </>
  );
};
