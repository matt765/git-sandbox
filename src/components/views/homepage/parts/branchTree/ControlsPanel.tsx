import styles from "./ControlsPanel.module.css";
import { useGitStore } from "@/store/gitStore";

const RotateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 12H4M12 20V4" />
    <path d="M17 7l5 5-5 5M7 7l-5 5 5 5" />
  </svg>
);

const LoadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

interface ControlsPanelProps {
  orientation: "vertical" | "horizontal";
  setOrientation: React.Dispatch<
    React.SetStateAction<"vertical" | "horizontal">
  >;
  onRotate: () => void;
}

export const ControlsPanel = ({
  orientation,
  onRotate,
}: ControlsPanelProps) => {
  const loadExample = useGitStore((state) => state.loadExample);

  return (
    <div className={styles.controlsPanel}>
      <button
        className={`${styles.controlButton} ${
          orientation === "horizontal" ? styles.active : ""
        }`}
        onClick={onRotate}
      >
        <RotateIcon />
        Rotate
      </button>
      <button 
        className={styles.controlButton}
        onClick={loadExample}
        title="Load repository example with 24 branches and 60 commits"
      >
        <LoadIcon />
        Load Example
      </button>
      <div className={styles.animationControls}>
        <button className={styles.controlButton}>
          <PlayIcon />
          Animate
        </button>
      </div>
    </div>
  );
};
