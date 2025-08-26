import { Navbar } from "./navbar/Navbar";
import styles from "./Layout.module.css";
import { GradientCanvas } from "./gradientCanvas/GradientCanvas";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <GradientCanvas />
      <Navbar />
      <main className={styles.mainWrapper}>
        <div className={styles.contentWrapper}>{children}</div>
      </main>
    </>
  );
};
