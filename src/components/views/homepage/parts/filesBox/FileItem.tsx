import styles from "./FileItem.module.css";
import { DeleteIcon } from "@/assets/icons/DeleteIcon";

interface FileItemProps {
  name: string;
  isStaged: boolean;
  onActionClick: () => void;
  onDeleteClick?: () => void;
}

export const FileItem = ({
  name,
  isStaged,
  onActionClick,
  onDeleteClick,
}: FileItemProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.fileDetails}>
        <span className={styles.fileName}>{name}</span>
      </div>
      <div className={styles.actionsWrapper}>
        {onDeleteClick && !isStaged && (
          <button className={styles.deleteButton} onClick={onDeleteClick}>
            <DeleteIcon />
          </button>
        )}
        <button 
          className={styles.actionButton}
          onClick={onActionClick}
        >
          {isStaged ? "-" : "+"}
        </button>
      </div>
    </div>
  );
};
