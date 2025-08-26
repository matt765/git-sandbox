import { SectionTitle } from "@/components/common/SectionTitle";
import { OutlinedButton } from "@/components/common/OutlinedButton";
import styles from "./MainButtons.module.css";

export const MainButtons = () => {
  return (
    <div className={styles.container}>
      <SectionTitle>Commits options</SectionTitle>
      <div className={styles.buttonsGrid}>
        <OutlinedButton>Cherry-pick</OutlinedButton>
        <OutlinedButton>Revert</OutlinedButton>
        <OutlinedButton>Reset</OutlinedButton>
        <OutlinedButton>Amend</OutlinedButton>
      </div>
    </div>
  );
};
