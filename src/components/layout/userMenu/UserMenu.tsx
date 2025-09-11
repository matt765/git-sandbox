"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./UserMenu.module.css";
import { HamburgerIcon } from "@/assets/icons/HamburgerIcon";
import { ThemeIcon } from "@/assets/icons/ThemeIcon";
import { GithubIcon } from "@/assets/icons/GithubIcon";
import { TerminalIcon } from "@/assets/icons/TerminalIcon";
import { PaintbrushIcon } from "@/assets/icons/PaintbrushIcon";
import { LoadExampleIcon } from "@/assets/icons/LoadExampleIcon";

interface UserMenuProps {
  onThemeToggle: () => void;
  currentTheme: string;
  onAboutClick: () => void;
  onChangelogClick: () => void;
  onContributeClick: () => void;
}

export const UserMenu = ({
  onThemeToggle,
  currentTheme,
  onAboutClick,
  onChangelogClick,
  onContributeClick,
}: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatThemeName = (theme: string) => {
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

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
              <button 
                className={styles.menuItem}
                onClick={() => handleOptionClick(onAboutClick)}
              >
                <LoadExampleIcon />
                About Project
              </button>
            </li>
            <li>
              <button 
                className={styles.menuItem}
                onClick={() => handleOptionClick(onChangelogClick)}
              >
                <TerminalIcon />
                Changelog
              </button>
            </li>        
            <li>
              <button 
                className={styles.menuItem}
                onClick={() => handleOptionClick(onContributeClick)}
              >
                <PaintbrushIcon />
                Contribute
              </button>
            </li>        
            <li>
              <button 
                className={styles.menuItem}
                onClick={(e) => {
                  e.stopPropagation();
                  onThemeToggle();
                }}
              >
                <ThemeIcon />
                Theme: {formatThemeName(currentTheme)}
              </button>
            </li>
            <li className={styles.separator}></li>
            <li>
              <a
                href="https://github.com/matt765/git-sandbox/discussions/1"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkAsButton}
              >
                <TerminalIcon />
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
                <GithubIcon />
                GitHub
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
