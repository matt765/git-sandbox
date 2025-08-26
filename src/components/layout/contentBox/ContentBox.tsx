import styles from "./ContentBox.module.css";

interface ContentBoxProps {
  children: React.ReactNode;
}

export const ContentBox = ({ children }: ContentBoxProps) => {
  return <div className={styles.box}>{children}</div>;
};
