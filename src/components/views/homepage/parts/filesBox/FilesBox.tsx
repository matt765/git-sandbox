// FilesBox.tsx
import { useState, useRef } from "react";
import { useGitStore } from "@/store/gitStore";
import { ChangesSection } from "./ChangesSection";
import styles from "./FilesBox.module.css";
import { ContainedButton } from "@/components/common/ContainedButton";
import { AddIcon } from "@/assets/icons/AddIcon";
import { PaintbrushIcon } from "@/assets/icons/PaintbrushIcon";
import { ResetIcon } from "@/assets/icons/ResetIcon";
import { useClickOutside } from "@/hooks/useClickOutside";

export const FilesBox = () => {
  const [message, setMessage] = useState("");
  const [hasValidationError, setHasValidationError] = useState(false);
  const commitInputRef = useRef<HTMLInputElement>(null);

  useClickOutside(commitInputRef, () => {
    if (hasValidationError) {
      setHasValidationError(false);
    }
  });

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
    if (!message.trim()) {
      setHasValidationError(true);
      return;
    }
    commit(message);
    setMessage("");
    setHasValidationError(false);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hasValidationError) {
      setHasValidationError(false);
    }
    setMessage(e.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Commit tylko przy Ctrl/Cmd + Enter
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleCommit();
    }
    // Zwykły Enter nic nie robi (zapobiegamy domyślnemu zachowaniu, np. submitowi formularza)
    else if (event.key === "Enter") {
      event.preventDefault();
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
        ref={commitInputRef}
        className={`${styles.commitInput} ${
          hasValidationError ? styles.error : ""
        }`}
        placeholder="Message (Ctrl+Enter to commit)"
        value={message}
        onChange={handleMessageChange}
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
      {/* ... reszta komponentu bez zmian ... */}
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
