"use client";

import { Navbar } from "./navbar/Navbar";
import styles from "./Layout.module.css";
import { GradientCanvas } from "./gradientCanvas/GradientCanvas";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      {/* <GradientCanvas /> */}
      <main className={styles.mainWrapper}>
        <div className={styles.contentWrapper}>{children}</div>
      </main>
    </>
  );
};
