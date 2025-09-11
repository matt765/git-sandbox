"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { UserMenu } from "../userMenu/UserMenu";
import { AboutModal } from "../userMenu/aboutModal/AboutModal";
import { ChangelogModal } from "../userMenu/changelogModal/ChangelogModal";
import { ContributeModal } from "../userMenu/contributeModal/ContributeModal";

// const THEMES = ["charcoal", "midnight", "snowlight"];
const THEMES = ["charcoal",  "fairytale",  "midnight", ];

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);

  useEffect(() => {
    if (theme && !THEMES.includes(theme)) {
      setTheme("charcoal");
    }
  }, [theme, setTheme]);

  const handleThemeToggle = () => {
    const currentIndex = THEMES.indexOf(theme ?? "charcoal");
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex]);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          {/* <span>Git Sandbox</span> */}
        </div>
        <div className={styles.actions}>
          <UserMenu
            onThemeToggle={handleThemeToggle}
            currentTheme={theme ?? "charcoal"}
            onAboutClick={() => setIsAboutModalOpen(true)}
            onChangelogClick={() => setIsChangelogModalOpen(true)}
            onContributeClick={() => setIsContributeModalOpen(true)}
          />
        </div>
      </nav>
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onContributeClick={() => setIsContributeModalOpen(true)}
      />
      <ChangelogModal
        isOpen={isChangelogModalOpen}
        onClose={() => setIsChangelogModalOpen(false)}
      />
      <ContributeModal
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
      />
    </>
  );
};
