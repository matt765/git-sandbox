// src/components/views/HomepageView/parts/mainButtons/modals/AmendModal.tsx
import { useState, useMemo } from "react";
import { useGitStore } from "@/store/gitStore";
import { ContainedButton } from "@/components/common/ContainedButton";
import styles from "./common.module.css";

interface AmendModalProps {
  onClose: () => void;
}

export const AmendModal = ({ onClose }: AmendModalProps) => {
  const [newMessage, setNewMessage] = useState("");
  const amend = useGitStore((state) => state.amend);
  const branches = useGitStore((state) => state.branches);
  const head = useGitStore((state) => state.HEAD);
  const commits = useGitStore((state) => state.commits);
  
  const lastCommitMessage = useMemo(() => {
    const headCommitId = branches[head.name]?.commitId;
    return commits[headCommitId]?.message || "";
  }, [branches, head.name, commits]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    amend(newMessage);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
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

      <div className={styles.actions}>
        <ContainedButton type="submit">Amend Commit</ContainedButton>
      </div>
    </form>
  );
};
