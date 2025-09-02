"use client";

import dynamic from "next/dynamic";
import styles from "./page.module.css";
import { HomepageView } from "@/components/views/homepage/HomepageView";

export default function Home() {
  return (
    <main className={styles.main}>
      <HomepageView />
    </main>
  );
}
