import { ReactNode } from "react";
import styles from "./SectionTitle.module.css";

interface SectionTitleProps {
  children: ReactNode;
}

export const SectionTitle = ({ children }: SectionTitleProps) => {
  return <p className={styles.title}>{children}</p>;
};
