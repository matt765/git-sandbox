"use client";

import { useTheme } from "next-themes";

import styles from "./Navbar.module.css";
import { GithubIcon } from "@/assets/icons/GithubIcon";
import { ThemeIcon } from "@/assets/icons/ThemeIcon";
import { useEffect } from "react";

const THEMES = ["charcoal", "midnight", "snowlight"];

export const Navbar = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme && !THEMES.includes(theme)) {
      setTheme('charcoal');
    }
  }, [theme, setTheme]);

  const cycleTheme = () => {
    const currentThemeIndex = THEMES.indexOf(theme ?? "charcoal");
    const nextThemeIndex = (currentThemeIndex + 1) % THEMES.length;
    setTheme(THEMES[nextThemeIndex]);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <span>Git Sandbox</span>
      </div>
      <div className={styles.actions}>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
        >
          <GithubIcon />
        </a>
        <button
          onClick={cycleTheme}
          className={styles.themeButton}
          aria-label="Change theme"
        >
          <ThemeIcon />
        </button>
      </div>
    </nav>
  );
};
