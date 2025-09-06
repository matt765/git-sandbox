// src/components/views/HomepageView/parts/mainButtons/MainButtons.tsx
import { useState } from "react";
import { SectionTitle } from "@/components/common/SectionTitle";
import { OutlinedButton } from "@/components/common/OutlinedButton";
import { useGitStore } from "@/store/gitStore";

import styles from "./MainButtons.module.css";
import { CherryPickModal } from "./modals/CherryPickModal";
import { RevertModal } from "./modals/RevertModal";
import { ResetModal, ResetMode } from "./modals/ResetModal";
import { AmendModal } from "./modals/AmendModal";
import { ActionModal } from "@/components/common/ActionModal";

type ActiveModal = "cherry-pick" | "revert" | "reset" | "amend" | null;

export const MainButtons = () => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  
  // Stan dla cherry-pick
  const [cherryPickCommit, setCherryPickCommit] = useState("");
  
  // Stan dla revert
  const [revertCommit, setRevertCommit] = useState("");
  
  // Stan dla reset
  const [resetCommit, setResetCommit] = useState("");
  const [resetMode, setResetMode] = useState<ResetMode>("mixed");
  
  // Stan dla amend
  const [amendMessage, setAmendMessage] = useState("");

  // Store actions
  const cherryPick = useGitStore((state) => state.cherryPick);
  const revert = useGitStore((state) => state.revert);
  const reset = useGitStore((state) => state.reset);
  const amend = useGitStore((state) => state.amend);

  const closeModal = () => {
    setActiveModal(null);
    // Reset form states
    setCherryPickCommit("");
    setRevertCommit("");
    setResetCommit("");
    setResetMode("mixed");
    setAmendMessage("");
  };

  const handleCherryPick = () => {
    if (cherryPickCommit) {
      cherryPick(cherryPickCommit);
      closeModal();
    }
  };

  const handleRevert = () => {
    if (revertCommit) {
      revert(revertCommit);
      closeModal();
    }
  };

  const handleReset = () => {
    if (resetCommit) {
      reset(resetCommit, resetMode);
      closeModal();
    }
  };

  const handleAmend = () => {
    amend(amendMessage);
    closeModal();
  };

  return (
    <>
      <div className={styles.container}>
        <SectionTitle>Commits options</SectionTitle>
        <div className={styles.buttonsGrid}>
          <OutlinedButton onClick={() => setActiveModal("cherry-pick")}>
            Cherry-pick
          </OutlinedButton>
          <OutlinedButton onClick={() => setActiveModal("revert")}>
            Revert
          </OutlinedButton>
          <OutlinedButton onClick={() => setActiveModal("reset")}>
            Reset
          </OutlinedButton>
          <OutlinedButton onClick={() => setActiveModal("amend")}>
            Amend
          </OutlinedButton>
        </div>
      </div>

      <ActionModal
        isOpen={activeModal === "cherry-pick"}
        onClose={closeModal}
        title="Cherry-pick a Commit"
        onAccept={handleCherryPick}
        acceptText="Cherry-pick"
        acceptDisabled={!cherryPickCommit}
      >
        <CherryPickModal 
          selectedCommit={cherryPickCommit}
          setSelectedCommit={setCherryPickCommit}
        />
      </ActionModal>

      <ActionModal
        isOpen={activeModal === "revert"}
        onClose={closeModal}
        title="Revert a Commit"
        onAccept={handleRevert}
        acceptText="Revert"
        acceptDisabled={!revertCommit}
      >
        <RevertModal 
          selectedCommit={revertCommit}
          setSelectedCommit={setRevertCommit}
        />
      </ActionModal>

      <ActionModal
        isOpen={activeModal === "reset"}
        onClose={closeModal}
        title="Reset Branch"
        onAccept={handleReset}
        acceptText="Reset"
        acceptDisabled={!resetCommit}
      >
        <ResetModal 
          selectedCommit={resetCommit}
          setSelectedCommit={setResetCommit}
          mode={resetMode}
          setMode={setResetMode}
        />
      </ActionModal>

      <ActionModal
        isOpen={activeModal === "amend"}
        onClose={closeModal}
        title="Amend Last Commit"
        onAccept={handleAmend}
        acceptText="Amend Commit"
      >
        <AmendModal 
          newMessage={amendMessage}
          setNewMessage={setAmendMessage}
        />
      </ActionModal>
    </>
  );
};
