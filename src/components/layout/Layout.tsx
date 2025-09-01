"use client";

import { Navbar } from "./navbar/Navbar";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <main className={styles.mainWrapper}>
        <div className={styles.contentWrapper}>{children}</div>
      </main>
    </>
  );
};
