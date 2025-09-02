"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./ContributeModal.module.css";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useContributing } from "@/hooks/useContributing";

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContributeModal = ({ isOpen, onClose }: ContributeModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { formattedContent, isLoading, error } = useContributing();

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

  const renderContent = () => {
    if (isLoading) {
      return <p>Loading...</p>;
    }
    if (error) {
      return <p>Error: {error}</p>;
    }
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: formattedContent,
        }}
      />
    );
  };

  const modalContent = (
    <div className={styles.backdrop}>
      <div ref={modalRef} className={styles.modalPanel}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Contributing guide</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className={styles.content}>{renderContent()}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
