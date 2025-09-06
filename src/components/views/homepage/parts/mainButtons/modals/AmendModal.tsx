// src/components/views/HomepageView/parts/mainButtons/modals/AmendModal.tsx
import { useMemo } from "react";
import { useGitStore } from "@/store/gitStore";
import styles from "./common.module.css";

interface AmendModalProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
}

export const AmendModal = ({ newMessage, setNewMessage }: AmendModalProps) => {
  const branches = useGitStore((state) => state.branches);
  const head = useGitStore((state) => state.HEAD);
  const commits = useGitStore((state) => state.commits);
  
  const lastCommitMessage = useMemo(() => {
    const headCommitId = branches[head.name]?.commitId;
    return commits[headCommitId]?.message || "";
  }, [branches, head.name, commits]);

  return (
    <div className={styles.form}>
      <label className={styles.label}>
        New commit message (optional)
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className={styles.input}
          placeholder={lastCommitMessage}
        />
        <p className={styles.description}>
          Combines staged changes with the last commit. Provide a new message or
          leave blank to keep the old one.
        </p>
      </label>
    </div>
  );
};
