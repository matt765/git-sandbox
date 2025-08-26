"use client";

import { ContentBox } from "@/components/layout/contentBox/ContentBox";
import styles from "./HomepageView.module.css";
import { BranchTree } from "./parts/branchTree/BranchTree";
import { CommandLine } from "./parts/commandLine/CommandLine";
import { Console } from "./parts/filesBox/FilesBox";

import { MainButtons } from "./parts/mainButtons/MainButtons";
import { AdvancedButtons } from "./parts/advancedButtons/AdvancedButtons";
import { LogHistory } from "./parts/logHistory/LogHistory";

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
          <CommandLine />
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
          <LogHistory />
        </ContentBox>
      </div>
      {/* <div className={styles.commandLine}>
        <ContentBox>
          <CommandLine />
        </ContentBox>
      </div> */}
    </div>
  );
};
