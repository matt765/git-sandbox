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
            <strong>Welcome to Git Sandbox!</strong> This is an interactive
            playground designed to help you learn and master Git in a safe,
            visual environment. No need to worry about messing up a real
            project.
          </p>
          <p>
            Experiment with a wide range of commands like <code>add</code>,{" "}
            <code>commit</code>, <code>branch</code>, <code>merge</code>, and{" "}
            <code>rebase</code>. Every action you take is instantly reflected in
            the visual graph, helping you build a strong mental model of how Git
            works.
          </p>
          <p>
            This project is open-source. For more information, to report an
            issue, or to contribute, please visit the official{" "}
            <a
              href="https://github.com/matt765/git-sandbox"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub repository
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
