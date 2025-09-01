"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { UserMenu } from "../userMenu/UserMenu";
import { AboutModal } from "../userMenu/aboutModal/AboutModal";
import { ChangelogModal } from "../userMenu/changelogModal/ChangelogModal";

const THEMES = ["charcoal", "midnight", "snowlight"];

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isLoadRepoModalOpen, setIsLoadRepoModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false);

  useEffect(() => {
    if (theme && !THEMES.includes(theme)) {
      setTheme("charcoal");
    }
  }, [theme, setTheme]);

  const cycleTheme = () => {
    const currentThemeIndex = THEMES.indexOf(theme ?? "charcoal");
    const nextThemeIndex = (currentThemeIndex + 1) % THEMES.length;
    setTheme(THEMES[nextThemeIndex]);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span>Git Sandbox</span>
        </div>
        <div className={styles.actions}>
          <UserMenu
            onLoadRepoClick={() => setIsLoadRepoModalOpen(true)}
            onThemeCycle={cycleTheme}
            onAboutClick={() => setIsAboutModalOpen(true)}
            onChangelogClick={() => setIsChangelogModalOpen(true)}
          />
        </div>
      </nav>
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
      <ChangelogModal
        isOpen={isChangelogModalOpen}
        onClose={() => setIsChangelogModalOpen(false)}
      />
    </>
  );
};
