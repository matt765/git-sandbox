"use client";

import { useEffect } from "react";
import { useGitStore } from "@/store/gitStore";
import { Portal } from "../common/Portal";
// Important: Adjust the import path if your TerminalWindow is in a different location
import { TerminalWindow } from "../views/homepage/parts/commandLine/TerminalWindow";
import { Navbar } from "./navbar/Navbar";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const isTerminalOpen = useGitStore((state) => state.isTerminalOpen);
  const closeTerminal = useGitStore((state) => state.closeTerminal);

  // Diagnostic log
  useEffect(() => {
    console.log("Layout: isTerminalOpen state is:", isTerminalOpen);
  }, [isTerminalOpen]);

  return (
    <>
      <Navbar />
      <main className={styles.mainWrapper}>
        <div className={styles.contentWrapper}>{children}</div>
           <div className={styles.overlay}></div>
      </main>

      {isTerminalOpen && (
        <Portal>
          <TerminalWindow onClose={closeTerminal} />
        </Portal>
      )}
    </>
  );
};
