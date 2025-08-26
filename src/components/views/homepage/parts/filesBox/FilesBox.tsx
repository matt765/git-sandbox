import { useState } from "react";

import { ChangesSection } from "./ChangesSection";
import styles from "./FilesBox.module.css";
import { ContainedButton } from "@/components/common/ContainedButton";

const initialFiles = [
  { id: 1, name: "Code1.tsx", isStaged: true },
  { id: 2, name: "Code2.tsx", isStaged: false },
  { id: 3, name: "styles.css", isStaged: false },
];

export const Console = () => {
  const [files, setFiles] = useState(initialFiles);

  const handleToggleStage = (fileId: number) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === fileId ? { ...file, isStaged: !file.isStaged } : file
      )
    );
  };

  const handleDeleteFile = (fileId: number) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  const stagedFiles = files.filter((file) => file.isStaged);
  const unstagedFiles = files.filter((file) => !file.isStaged);

  return (
    <div className={styles.container}>
      <input
        className={styles.commitInput}
        placeholder="Message (Ctrl+Enter to commit)"
      />
      <div className={styles.buttonWrapper}>
        <ContainedButton>Commit</ContainedButton>
      </div>
      <div className={styles.changesContainer}>
        <ChangesSection
          title="Staged Changes"
          files={stagedFiles}
          onFileAction={handleToggleStage}
        />
        <ChangesSection
          title="Changes"
          files={unstagedFiles}
          onFileAction={handleToggleStage}
          onDeleteFile={handleDeleteFile}
          hideCount={true}
        />
      </div>
    </div>
  );
};
