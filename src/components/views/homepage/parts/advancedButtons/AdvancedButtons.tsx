import { SectionTitle } from "@/components/common/SectionTitle";
import { OutlinedButton } from "@/components/common/OutlinedButton";
import styles from "./AdvancedButtons.module.css";

export const AdvancedButtons = () => {
  return (
    <div className={styles.container}>
      <SectionTitle>Branches options</SectionTitle>
      <div className={styles.buttonsGrid}>
        <OutlinedButton>Merge</OutlinedButton>
        <OutlinedButton>Rebase</OutlinedButton>
        <OutlinedButton>Create branch</OutlinedButton>
        <OutlinedButton>Delete branch</OutlinedButton>
      </div>
    </div>
  );
};
