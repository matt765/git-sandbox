"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./AboutModal.module.css";
import { useClickOutside } from "@/hooks/useClickOutside";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContributeClick: () => void;
}

export const AboutModal = ({ isOpen, onClose, onContributeClick }: AboutModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, onClose);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div className={styles.backdrop}>
      <div ref={modalRef} className={styles.modalPanel}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>About project</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className={styles.content}>
          <p>
            Git Sandbox is an interactive playground designed to help you learn
            and master Git in a safe, visual environment. No need to worry about
            messing up a real project.
          </p>
          <p>
            This project is open-source. If you want to support this project and
            its future development with new features and improvements, read{" "}
            <button
              onClick={() => {
                onClose();
                onContributeClick();
              }}
              className={styles.linkButton}
            >
              the contributing guide
            </button>
            . Every contribution is greatly appreciated.<br /> <br />I hope you find the
            application helpful.<br /><br /> ~matt765
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
