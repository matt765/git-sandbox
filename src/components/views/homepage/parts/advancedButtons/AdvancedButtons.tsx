import { useState } from "react";
import { SectionTitle } from "@/components/common/SectionTitle";
import { OutlinedButton } from "@/components/common/OutlinedButton";
import { Modal } from "@/components/common/Modal";
import { MergeBranchModal } from "./modals/MergeBranchModal";
import { CreateBranchModal } from "./modals/CreateBranchModal";
import { DeleteBranchModal } from "./modals/DeleteBranchModal";
import { SwitchBranchModal } from "./modals/SwitchBranchModal";
import styles from "./AdvancedButtons.module.css";

type ActiveModal = "merge" | "switch" | "create" | "delete" | null;

export const AdvancedButtons = () => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const closeModal = () => setActiveModal(null);

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
          <OutlinedButton onClick={() => setActiveModal("create")}>
            Create branch
          </OutlinedButton>
          <OutlinedButton onClick={() => setActiveModal("delete")}>
            Delete branch
          </OutlinedButton>
        </div>
      </div>

      <Modal
        isOpen={activeModal === "merge"}
        onClose={closeModal}
        title="Merge Branch"
      >
        <MergeBranchModal onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={activeModal === "switch"}
        onClose={closeModal}
        title="Switch Branch"
      >
        <SwitchBranchModal onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={activeModal === "create"}
        onClose={closeModal}
        title="Create New Branch"
      >
        <CreateBranchModal onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={activeModal === "delete"}
        onClose={closeModal}
        title="Delete Branch"
      >
        <DeleteBranchModal onClose={closeModal} />
      </Modal>
    </>
  );
};
