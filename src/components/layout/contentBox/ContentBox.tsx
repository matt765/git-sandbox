import styles from "./ContentBox.module.css";

interface ContentBoxProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const ContentBox = ({
  children,
  noPadding = false,
}: ContentBoxProps) => {
  const boxClasses = `${styles.box} ${noPadding ? styles.noPadding : ""}`;
  return <div className={boxClasses}>{children}</div>;
};
