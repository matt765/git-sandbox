"use client"; 

import dynamic from "next/dynamic";
import styles from "./page.module.css";


const HomepageView = dynamic(
  () =>
    import("@/components/views/homepage/HomepageView").then(
      (mod) => mod.HomepageView
    ),
  {
    ssr: false,
    loading: () => <p className={styles.loading}>Loading Sandbox...</p>,
  }
);

export default function Home() {
  return (
    <main className={styles.main}>
      <HomepageView />
    </main>
  );
}
