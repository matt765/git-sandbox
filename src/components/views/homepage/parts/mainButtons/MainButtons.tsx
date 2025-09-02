// src/components/views/HomepageView/parts/mainButtons/MainButtons.tsx
import { useState } from "react";
import { SectionTitle } from "@/components/common/SectionTitle";
import { OutlinedButton } from "@/components/common/OutlinedButton";

import styles from "./MainButtons.module.css";
import { CherryPickModal } from "./modals/CherryPickModal";
import { RevertModal } from "./modals/RevertModal";
import { ResetModal } from "./modals/ResetModal";
import { AmendModal } from "./modals/AmendModal";
import { Modal } from "@/components/common/Modal";

type ActiveModal = "cherry-pick" | "revert" | "reset" | "amend" | null;

export const MainButtons = () => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const closeModal = () => setActiveModal(null);

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

      <Modal
        isOpen={activeModal === "cherry-pick"}
        onClose={closeModal}
        title="Cherry-pick a Commit"
      >
        <CherryPickModal onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={activeModal === "revert"}
        onClose={closeModal}
        title="Revert a Commit"
      >
        <RevertModal onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={activeModal === "reset"}
        onClose={closeModal}
        title="Reset Branch"
      >
        <ResetModal onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={activeModal === "amend"}
        onClose={closeModal}
        title="Amend Last Commit"
      >
        <AmendModal onClose={closeModal} />
      </Modal>
    </>
  );
};
