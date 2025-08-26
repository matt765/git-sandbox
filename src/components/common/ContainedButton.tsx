import { ReactNode } from "react";
import styles from "./ContainedButton.module.css";

interface ContainedButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export const ContainedButton = ({
  children,
  onClick,
}: ContainedButtonProps) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};
