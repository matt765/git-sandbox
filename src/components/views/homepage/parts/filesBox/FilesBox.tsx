// Console.tsx (lub FilesBox.tsx)
import { useState } from "react";
import { useGitStore } from "@/store/gitStore";
import { ChangesSection } from "./ChangesSection";
import styles from "./FilesBox.module.css";
import { ContainedButton } from "@/components/common/ContainedButton";
import { AddIcon } from "@/assets/icons/AddIcon";
import { PaintbrushIcon } from "@/assets/icons/PaintbrushIcon";
import { ResetIcon } from "@/assets/icons/ResetIcon";

export const Console = () => {
  const [message, setMessage] = useState("");
  const {
    commit,
    workingDirectory,
    stagingArea,
    stageFile,
    unstageFile,
    addFile,
    resetApp,
    stageAllFiles,
    unstageAllFiles,
    discardAllChanges,
  } = useGitStore();

  const handleCommit = () => {
    commit(message);
    setMessage("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      handleCommit();
    }
  };

  const stagedFilesForDisplay = stagingArea.map((file) => ({
    ...file,
    isStaged: true,
  }));
  const unstagedFilesForDisplay = workingDirectory.map((file) => ({
    ...file,
    isStaged: false,
  }));

  return (
    <div className={styles.container}>
      <input
        className={styles.commitInput}
        placeholder="Message (Ctrl+Enter to commit)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className={styles.buttonWrapper}>
        <ContainedButton
          onClick={handleCommit}
          disabled={stagingArea.length === 0}
        >
          Commit
        </ContainedButton>
      </div>
      <div className={styles.changesContainer}>
        <ChangesSection
          title="Staged Changes"
          files={stagedFilesForDisplay}
          onFileAction={(id) => unstageFile(id)}
          onHeaderAction={unstageAllFiles}
          headerActionIcon="-"
        />
        <ChangesSection
          title="Changes"
          files={unstagedFilesForDisplay}
          onFileAction={(id) => stageFile(id)}
          hideCount={true}
          onHeaderAction={stageAllFiles}
          headerActionIcon="+"
        />
      </div>
      <div className={styles.footer}>
        <div className={styles.footerActions}>
          <button
            className={styles.iconButton}
            onClick={addFile}
            title="Add new file"
          >
            <AddIcon />
          </button>
          <button
            className={styles.iconButton}
            onClick={discardAllChanges}
            title="Discard all changes"
          >
            <PaintbrushIcon />
          </button>
          <button
            className={styles.iconButton}
            onClick={resetApp}
            title="Reset app to default"
          >
            <ResetIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
