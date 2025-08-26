import { ContentBox } from "@/components/layout/contentBox/ContentBox";
import styles from "./HomepageView.module.css";
import { BranchTree } from "./parts/branchTree/BranchTree";
import { CommandLine } from "./parts/commandLine/CommandLine";
import { Console } from "./parts/console/Console";
import { Stash } from "./parts/stash/Stash";
import { MainButtons } from "./parts/mainButtons/MainButtons";
import { AdvancedButtons } from "./parts/advancedButtons/AdvancedButtons";
import { ResetButtons } from "./parts/resetButtons/ResetButtons";

export const HomepageView = () => {
  return (
    <div className={styles.grid}>
      <div className={styles.branchTree}>
        <ContentBox>
          <BranchTree />
        </ContentBox>
      </div>
      <div className={styles.console}>
        <ContentBox>
          <Console />
        </ContentBox>
      </div>
      <div className={styles.stash}>
        <ContentBox>
          <Stash />
        </ContentBox>
      </div>
      <div className={styles.mainButtons}>
        <ContentBox>
          <MainButtons />
        </ContentBox>
      </div>
      <div className={styles.advancedButtons}>
        <ContentBox>
          <AdvancedButtons />
        </ContentBox>
      </div>
      <div className={styles.resetButtons}>
        <ContentBox>
          <ResetButtons />
        </ContentBox>
      </div>
      <div className={styles.commandLine}>
        <ContentBox>
          <CommandLine />
        </ContentBox>
      </div>
    </div>
  );
};
