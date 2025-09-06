"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "@/assets/icons/CloseIcon";
import { ContainedButton } from "./ContainedButton";
import { OutlinedButton } from "./OutlinedButton";
import styles from "./ActionModal.module.css";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  onAccept?: () => void;
  acceptText?: string;
  acceptDisabled?: boolean;
  showCancelButton?: boolean;
  cancelText?: string;
}

export const ActionModal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  onAccept, 
  acceptText = "Accept", 
  acceptDisabled = false,
  showCancelButton = true,
  cancelText = "Cancel"
}: ActionModalProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const handleClose = useCallback(() => {
    onClose();
    setDragPosition({ x: 0, y: 0 });
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);

    const initialX = e.clientX;
    const initialY = e.clientY;
    const initialTranslateX = dragPosition.x;
    const initialTranslateY = dragPosition.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - initialX;
      const dy = moveEvent.clientY - initialY;
      setDragPosition({
        x: initialTranslateX + dx,
        y: initialTranslateY + dy,
      });
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={handleClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)`,
          cursor: isDragging ? "grabbing" : "default",
        }}
      >
        <div className={styles.header} onMouseDown={onMouseDown}>
          <h2 className={styles.title}>{title}</h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
        {onAccept && (
          <div className={styles.actions}>
            {showCancelButton && (
              <OutlinedButton onClick={handleClose}>
                {cancelText}
              </OutlinedButton>
            )}
            <ContainedButton onClick={onAccept} disabled={acceptDisabled}>
              {acceptText}
            </ContainedButton>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
