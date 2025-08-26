import { useState } from "react";
import styles from "./ChangesSection.module.css";
import { FileItem } from "./FileItem";

interface FileData {
  id: number;
  name: string;
  isStaged: boolean;
}

interface ChangesSectionProps {
  title: string;
  files: FileData[];
  onFileAction: (id: number) => void;
  onDeleteFile?: (id: number) => void;
  hideCount?: boolean;
}

export const ChangesSection = ({
  title,
  files,
  onFileAction,
  onDeleteFile,
  hideCount = false,
}: ChangesSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (files.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <button className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <span className={`${styles.arrow} ${isOpen ? styles.open : ""}`}>
          ▼
        </span>
        <span className={styles.title}>{title}</span>
        {/* {!hideCount && <span className={styles.count}>{files.length}</span>} */}
      </button>
      {isOpen && (
        <div className={styles.content}>
          {files.map((file) => (
            <FileItem
              key={file.id}
              name={file.name}
              isStaged={file.isStaged}
              onActionClick={() => onFileAction(file.id)}
              onDeleteClick={
                onDeleteFile ? () => onDeleteFile(file.id) : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};
