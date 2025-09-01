"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./AboutModal.module.css";
import { useClickOutside } from "@/hooks/useClickOutside";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
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
          <h2 className={styles.title}>About Git Sandbox</h2>
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
            its future development with new features and improvements, you can
            report an issue, contribute code or use
            <a
              href="https://buymeacoffee.com/matt765"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy Me A Coffeeservice
            </a>
            Every contribution is greatly appreciated.<br /> <br />I hope you find the
            application helpful.<br /><br /> ~matt765
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
