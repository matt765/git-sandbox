import React, { ReactNode } from "react";
import styles from "./OutlinedButton.module.css";

interface OutlinedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export const OutlinedButton = ({
  children,
  className,
  ...props
}: OutlinedButtonProps) => {
  const buttonClasses = `${styles.button} ${className || ""}`;

  return (
    <button className={buttonClasses.trim()} {...props}>
      {children}
    </button>
  );
};
