import { useState } from "react";
import { useGitStore } from "@/store/gitStore";
import { ChangesSection } from "./ChangesSection";
import styles from "./FilesBox.module.css";
import { ContainedButton } from "@/components/common/ContainedButton";
import { AddIcon } from "@/assets/icons/AddIcon";

export const Console = () => {
  const [message, setMessage] = useState("");
  const {
    commit,
    workingDirectory,
    stagingArea,
    stageFile,
    unstageFile,
    addFile,
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
        />
        <ChangesSection
          title="Changes"
          files={unstagedFilesForDisplay}
          onFileAction={(id) => stageFile(id)}
          hideCount={true}
        />
      </div>
      <div className={styles.footer}>
        <button className={styles.addButton} onClick={addFile}>
          {/* <AddIcon /> */}+ Add new file
        </button>
      </div>
    </div>
  );
};
