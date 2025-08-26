import styles from "./BranchTree.module.css";

export const BranchTree = () => {
  return (
    <div className={styles.container}>
      <div className={styles.graphWrapper}>
        <div className={styles.graphContainer}>
          <svg className={styles.svgCanvas}>
            {/* Main branch lines */}
            <line
              x1="100"
              y1="91"
              x2="100"
              y2="151"
              stroke="#4a5568"
              strokeWidth="2"
            />
            <line
              x1="100"
              y1="179"
              x2="100"
              y2="239"
              stroke="#4a5568"
              strokeWidth="2"
            />
            <line
              x1="100"
              y1="267"
              x2="100"
              y2="327"
              stroke="#4a5568"
              strokeWidth="2"
            />

            {/* Feature branch lines */}
            <path
              d="M 100 165 C 150 165, 200 115, 250 115"
              stroke="#4a5568"
              strokeWidth="2"
              fill="none"
            />
            <line
              x1="250"
              y1="131"
              x2="250"
              y2="191"
              stroke="#4a5568"
              strokeWidth="2"
            />

            {/* HEAD dashed line */}
            <line
              x1="340"
              y1="80"
              x2="262"
              y2="100"
              stroke="#a78bfa"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>

          {/* main branch */}
          <div
            className={`${styles.branchLabel} ${styles.labelMain}`}
            style={{ top: "35px", left: "75px" }}
          >
            main
          </div>
          <div
            className={styles.commitNode}
            style={{ top: "80px", left: "90px" }}
          >
            <div
              className={`${styles.commitCircle} ${styles.commitCircleMain}`}
            ></div>
            <span className={styles.commitHash} style={{ left: "25px" }}>
              a568e1
            </span>
          </div>
          <div
            className={styles.commitNode}
            style={{ top: "168px", left: "90px" }}
          >
            <div
              className={`${styles.commitCircle} ${styles.commitCircleMain}`}
            ></div>
          </div>
          <div
            className={styles.inlineCommitHash}
            style={{ top: "154px", left: "30px" }}
          >
            7a19bf
          </div>

          <div
            className={styles.commitNode}
            style={{ top: "256px", left: "90px" }}
          >
            <div
              className={`${styles.commitCircle} ${styles.commitCircleMain}`}
            ></div>
            <span className={styles.commitHash} style={{ left: "25px" }}>
              3009a
            </span>
          </div>
          <div
            className={styles.commitNode}
            style={{ top: "328px", left: "90px" }}
          >
            <div
              className={`${styles.commitCircle} ${styles.commitCircleYellow}`}
            ></div>
            <span className={styles.commitHash} style={{ left: "25px" }}>
              f9821b
            </span>
          </div>
          <div
            className={styles.versionTag}
            style={{ top: "200px", left: "55px" }}
          >
            v1.0
          </div>

          {/* feature branch */}
          <div
            className={`${styles.branchLabel} ${styles.labelFeature}`}
            style={{ top: "45px", left: "225px" }}
          >
            feature
          </div>
          <div
            className={styles.headLabel}
            style={{ top: "65px", left: "340px" }}
          >
            HEAD
          </div>

          <div
            className={styles.commitNode}
            style={{ top: "120px", left: "240px" }}
          >
            <div
              className={`${styles.commitCircle} ${styles.commitCircleFeature}`}
            ></div>
          </div>
          <div
            className={styles.inlineCommitHash}
            style={{ top: "107px", left: "160px" }}
          >
            c4553b
          </div>

          <div
            className={styles.commitNode}
            style={{ top: "200px", left: "240px" }}
          >
            <div
              className={`${styles.commitCircle} ${styles.commitCircleFeature}`}
            ></div>
            <span className={styles.commitHash} style={{ left: "25px" }}>
              3009a
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
