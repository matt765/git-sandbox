"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./UserMenu.module.css";
import { HamburgerIcon } from "@/assets/icons/HamburgerIcon";

interface UserMenuProps {
  onThemeCycle: () => void;
  onAboutClick: () => void;
  onChangelogClick: () => void;
  onContributeClick: () => void;
}

export const UserMenu = ({
  onThemeCycle,
  onAboutClick,
  onChangelogClick,
  onContributeClick,
}: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.iconButton}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open user menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <HamburgerIcon />
      </button>

      {isOpen && (
        <div className={styles.menu}>
          <ul>
            <li>
              <button onClick={() => handleOptionClick(onAboutClick)}>
                About Project
              </button>
            </li>
            <li>
              <button onClick={() => handleOptionClick(onChangelogClick)}>
                Changelog
              </button>
            </li>        
            <li>
              <button onClick={onThemeCycle}>Switch theme</button>
            </li>
            <li className={styles.separator}></li>
            <li>
              <a
                href="https://github.com/matt765/git-sandbox/discussions/1"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkAsButton}
              >
                Discussion
              </a>
            </li>          
            <li>
              <a
                href="https://github.com/matt765/git-sandbox"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkAsButton}
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
