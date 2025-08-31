import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./ContainedButton.module.css";

interface ContainedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const ContainedButton = ({
  children,
  ...props
}: ContainedButtonProps) => {
  return (
    <button className={styles.button} {...props}>
      {children}
    </button>
  );
};
