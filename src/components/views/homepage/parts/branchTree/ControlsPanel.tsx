import styles from "./ControlsPanel.module.css";
import { useGitStore } from "@/store/gitStore";
import { useRef, useCallback, useState, useEffect } from "react";
import { Tooltip } from "@/components/common/Tooltip";

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

const DiceIcon = () => (
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
    <rect width="16" height="16" x="3" y="3" rx="2" ry="2"/>
    <path d="M12 8v8"/>
    <path d="m8 12 8 0"/>
    <circle cx="8" cy="8" r="1"/>
    <circle cx="16" cy="8" r="1"/>
    <circle cx="8" cy="16" r="1"/>
    <circle cx="16" cy="16" r="1"/>
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
  const performRandomAction = useGitStore((state) => state.performRandomAction);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(25); // Default to 25% (current speed)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate interval based on speed (25% = 140ms, 100% = 8.5ms, 10% = much slower)
  const getInterval = useCallback(() => {
    if (speed <= 10) return 2000; // Very slow for low speeds
    return 200 - (speed * 1.9); // 25% = 152.5ms, 100% = 10ms
  }, [speed]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default behavior
    
    // Perform one action immediately
    performRandomAction();
    
    // Only start continuous animation if speed > 10%
    if (speed <= 10) return;
    
    // Start continuous animation after 500ms
    const timeout = setTimeout(() => {
      setIsAnimating(true);
      
      const startInterval = () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
          performRandomAction();
        }, getInterval());
      };
      
      startInterval();
    }, 500);

    const cleanup = () => {
      clearTimeout(timeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsAnimating(false);
    };

    const handleMouseUp = () => {
      cleanup();
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);
  }, [performRandomAction, getInterval, speed]);

  // Update interval when speed changes during animation
  useEffect(() => {
    if (isAnimating && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        performRandomAction();
      }, getInterval());
    }
  }, [speed, isAnimating, performRandomAction, getInterval]);

  const handleClick = useCallback(() => {
    // This will only fire for actual clicks, not mousedown events
    // mousedown already performs the action, so we don't want double actions
  }, []);

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
        Load example
      </button>
      <div className={styles.animationControls}>
        <button 
          className={`${styles.controlButton} ${isAnimating ? styles.active : ''}`}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          title="Click for single random action, hold for continuous animation"
        >
          <DiceIcon />
          Random action
        </button>
        <Tooltip text="Random action speed" position="top">
          <input
            id="speed-slider"
            type="range"
            min="10"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className={styles.speedSlider}
          />
        </Tooltip>
      </div>
    </div>
  );
};
