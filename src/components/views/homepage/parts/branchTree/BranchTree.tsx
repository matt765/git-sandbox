import { useGitStore, Commit } from "@/store/gitStore";
import styles from "./BranchTree.module.css";
import {
  useMemo,
  useState,
  useRef,
  WheelEvent,
  MouseEvent,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { ControlsPanel } from "./ControlsPanel";

// --- INTERFACES ---
interface Node {
  id: string;
  message: string;
  x: number;
  y: number;
  color: string;
  depth: number;
  commitData: Commit;
}

interface Edge {
  key: string;
  path: string;
  color: string;
}

interface Label {
  name: string;
  x: number;
  y: number;
  color: string;
  isHead: boolean;
  commitId: string;
}

interface TooltipData {
  nodeId: string;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
  labels: Label[];
}

// --- CONSTANTS ---
const Y_STEP = 80;
const X_STEP = 150;
const HORIZONTAL_Y_STEP = Y_STEP * 1.5;
const PADDING_X = 150;
const PADDING_Y = 100;
const LABEL_ROW_Y = 40;
const GRAY_COLOR = "#4a5568";
const LANE_COLORS = ["#38b2ac", "#a78bfa", "#f6ad55", "#ec4899"];
const TOOLTIP_WIDTH = 250;
const TOOLTIP_OFFSET = 20;

// --- ICONS ---
const FullscreenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {" "}
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />{" "}
  </svg>
);
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {" "}
    <line x1="18" y1="6" x2="6" y2="18"></line>{" "}
    <line x1="6" y1="6" x2="18" y2="18"></line>{" "}
  </svg>
);

export const BranchTree = () => {
  const commits = useGitStore((state) => state.commits);
  const branches = useGitStore((state) => state.branches);
  const head = useGitStore((state) => state.HEAD);

  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.9);
  const [fullscreenPan, setFullscreenPan] = useState({ x: 0, y: 0 });
  const [fullscreenScale, setFullscreenScale] = useState(1.1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEnteringFullscreen, setIsEnteringFullscreen] = useState(false);
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">(
    "vertical"
  );
  const [isFading, setIsFading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);
  const initialPanSet = useRef(false);

  const isVertical = orientation === "vertical";

  useEffect(() => {
    if (!initialPanSet.current && wrapperRef.current && !isFullscreen) {
      const wrapperWidth = wrapperRef.current.offsetWidth;
      const numLanes = Object.keys(branches).length;
      const contentWidth = PADDING_X + numLanes * X_STEP;
      const initialX = (wrapperWidth - contentWidth) / 2;
      setPan({ x: initialX, y: 40 });
      initialPanSet.current = true;
    }
  }, [branches, isFullscreen]);

  const {
    nodes,
    edges,
    labels,
    nodeMap,
  }: GraphData & { nodeMap: Map<string, Node> } = useMemo(() => {
    const branchNames = Object.keys(branches);
    const sortedBranchNames = [...branchNames].sort(
      (a, b) => branches[a].position - branches[b].position
    );
    const laneAssignments = new Map<string, number>(
      sortedBranchNames.map((name, i) => [name, i])
    );
    const colorAssignments = new Map<string, string>(
      sortedBranchNames.map((name, i) => [
        name,
        LANE_COLORS[i % LANE_COLORS.length],
      ])
    );
    const commitList = Object.values(commits);
    const commitDepths = new Map<string, number>();
    const getDepth = (commitId: string | null): number => {
      if (!commitId || !commits[commitId]) return -1;
      if (commitDepths.has(commitId)) return commitDepths.get(commitId)!;
      const parentIds = Array.isArray(commits[commitId].parent)
        ? (commits[commitId].parent as string[])
        : [commits[commitId].parent as string].filter(Boolean);
      const maxParentDepth =
        parentIds.length > 0
          ? Math.max(...parentIds.map((p) => getDepth(p)))
          : -1;
      const depth = maxParentDepth + 1;
      commitDepths.set(commitId, depth);
      return depth;
    };
    commitList.forEach((c) => getDepth(c.id));
    const internalNodeMap = new Map<string, Node>();
    const calculatedNodes: Node[] = [];
    const commitToBranch = new Map<string, string>();
    if (branches.main) {
      let currentId: string | null = branches.main.commitId;
      while (currentId && commits[currentId]) {
        if (!commitToBranch.has(currentId))
          commitToBranch.set(currentId, "main");
        const parent: string | string[] | null | undefined =
          commits[currentId]?.parent;
        currentId = Array.isArray(parent) ? parent[0] : parent ?? null;
      }
    }
    sortedBranchNames.forEach((branchName) => {
      if (branchName === "main") return;
      let currentId: string | null = branches[branchName].commitId;
      while (currentId && commits[currentId]) {
        if (!commitToBranch.has(currentId))
          commitToBranch.set(currentId, branchName);
        const parent: string | string[] | null | undefined =
          commits[currentId]?.parent;
        currentId = Array.isArray(parent) ? parent[0] : parent ?? null;
      }
    });
    commitList.forEach((commit) => {
      const branchName = commitToBranch.get(commit.id) || "main";
      const lane = laneAssignments.get(branchName) ?? 0;
      const depth = commitDepths.get(commit.id) ?? 0;
      const node: Node = {
        id: commit.id,
        message: commit.message,
        x: PADDING_X + (isVertical ? lane * X_STEP : depth * X_STEP),
        y: PADDING_Y + (isVertical ? depth * Y_STEP : lane * HORIZONTAL_Y_STEP),
        color: colorAssignments.get(branchName) ?? LANE_COLORS[0],
        depth: depth,
        commitData: commit,
      };
      calculatedNodes.push(node);
      internalNodeMap.set(commit.id, node);
    });
    const calculatedEdges: Edge[] = [];
    sortedBranchNames.forEach((branchName) => {
      const branchCommitId = branches[branchName].commitId;
      const existingNode = internalNodeMap.get(branchCommitId);
      if (existingNode && commitToBranch.get(branchCommitId) !== branchName) {
        const lane = laneAssignments.get(branchName) ?? 0;
        const markerNode: Node = {
          id: `marker-${branchName}-${branchCommitId}`,
          message: existingNode.message,
          x:
            PADDING_X +
            (isVertical ? lane * X_STEP : existingNode.depth * X_STEP),
          y:
            PADDING_Y +
            (isVertical
              ? existingNode.depth * Y_STEP
              : lane * HORIZONTAL_Y_STEP),
          color: colorAssignments.get(branchName) ?? LANE_COLORS[0],
          depth: existingNode.depth,
          commitData: existingNode.commitData,
        };
        calculatedNodes.push(markerNode);
        calculatedEdges.push({
          key: `branch-connection-${branchName}-${branchCommitId}`,
          path: `M ${existingNode.x} ${existingNode.y} L ${markerNode.x} ${markerNode.y}`,
          color: markerNode.color,
        });
      }
    });
    const calculatedLabels: Label[] = sortedBranchNames.map((name) => {
      const lane = laneAssignments.get(name) ?? 0;
      return {
        name,
        x: PADDING_X + (isVertical ? lane * X_STEP : 0),
        y: PADDING_Y + (isVertical ? 0 : lane * HORIZONTAL_Y_STEP),
        color: colorAssignments.get(name) ?? LANE_COLORS[0],
        isHead: head.type === "branch" && head.name === name,
        commitId: branches[name].commitId,
      };
    });
    const lanes = new Map<number, Node[]>();
    calculatedNodes.forEach((node) => {
      const laneKey = isVertical ? node.x : node.y;
      if (!lanes.has(laneKey)) lanes.set(laneKey, []);
      lanes.get(laneKey)!.push(node);
    });
    lanes.forEach((nodesOnLane) => {
      nodesOnLane.sort((a, b) => (isVertical ? a.y - b.y : a.x - b.x));
      for (let i = 0; i < nodesOnLane.length - 1; i++) {
        const startNode = nodesOnLane[i];
        const endNode = nodesOnLane[i + 1];
        calculatedEdges.push({
          key: `gray-trunk-${startNode.id}-${endNode.id}`,
          path: `M ${startNode.x} ${startNode.y} L ${endNode.x} ${endNode.y}`,
          color: GRAY_COLOR,
        });
      }
    });
    commitList.forEach((commit) => {
      const parentIds = commit.parent
        ? Array.isArray(commit.parent)
          ? commit.parent
          : [commit.parent]
        : [];
      parentIds.forEach((parentId) => {
        if (internalNodeMap.has(commit.id) && internalNodeMap.has(parentId)) {
          const childNode = internalNodeMap.get(commit.id)!;
          const parentNode = internalNodeMap.get(parentId)!;
          let path;
          if (
            (isVertical && childNode.x === parentNode.x) ||
            (!isVertical && childNode.y === parentNode.y)
          ) {
            path = `M ${parentNode.x} ${parentNode.y} L ${childNode.x} ${childNode.y}`;
          } else {
            if (isVertical) {
              path = `M ${parentNode.x} ${parentNode.y} C ${parentNode.x} ${
                parentNode.y + Y_STEP / 2
              }, ${childNode.x} ${childNode.y - Y_STEP / 2}, ${childNode.x} ${
                childNode.y
              }`;
            } else {
              path = `M ${parentNode.x} ${parentNode.y} C ${
                parentNode.x + X_STEP / 2
              } ${parentNode.y}, ${childNode.x - X_STEP / 2} ${childNode.y}, ${
                childNode.x
              } ${childNode.y}`;
            }
          }
          calculatedEdges.push({
            key: `${parentId}-${commit.id}`,
            path,
            color: childNode.color,
          });
        }
      });
    });
    calculatedLabels.forEach((label) => {
      const laneKey = isVertical ? label.x : label.y;
      const nodesOnLane = lanes.get(laneKey);
      if (nodesOnLane && nodesOnLane.length > 0) {
        nodesOnLane.sort((a, b) => (isVertical ? a.y - b.y : a.x - b.x));
        const firstNode = nodesOnLane[0];
        const color =
          commitToBranch.get(firstNode.commitData.id) === label.name
            ? label.color
            : GRAY_COLOR;
        calculatedEdges.push({
          key: `label-trunk-${label.name}`,
          path: isVertical
            ? `M ${label.x} ${LABEL_ROW_Y} L ${firstNode.x} ${firstNode.y}`
            : `M ${PADDING_X - 50} ${label.y} L ${firstNode.x} ${firstNode.y}`,
          color: color,
        });
      }
    });
    return {
      nodes: calculatedNodes,
      edges: calculatedEdges,
      labels: calculatedLabels,
      nodeMap: internalNodeMap,
    };
  }, [commits, branches, head, orientation, isVertical]);

  useEffect(() => {
    if (isEnteringFullscreen && wrapperRef.current) {
      const wrapperWidth = wrapperRef.current.offsetWidth;
      const wrapperHeight = wrapperRef.current.offsetHeight;
      const numLanes = Object.keys(branches).length;
      const maxDepth = Math.max(0, ...nodes.map((n) => n.depth));
      const contentWidth =
        PADDING_X * 2 + (isVertical ? numLanes * X_STEP : maxDepth * X_STEP);
      const contentHeight =
        PADDING_Y * 2 +
        (isVertical ? maxDepth * Y_STEP : numLanes * HORIZONTAL_Y_STEP);
      const initialX = (wrapperWidth - contentWidth) / 2;
      const initialY = (wrapperHeight - contentHeight) / 2;
      setFullscreenPan({ x: initialX, y: initialY });
      setFullscreenScale(1.1);
      setTooltip(null);
      setIsEnteringFullscreen(false);
    }
  }, [isEnteringFullscreen, branches, nodes, orientation, isVertical]);

  const handleRotateRequest = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setOrientation((prev) =>
        prev === "vertical" ? "horizontal" : "vertical"
      );
      requestAnimationFrame(() => {
        setIsFading(false);
      });
    }, 200);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    // --- FIX: Hide tooltip on drag start ---
    if (tooltip) {
      setTooltip(null);
    }

    if (e.button !== 0) return;
    e.preventDefault();
    isPanning.current = true;
    const currentPan = isFullscreen ? fullscreenPan : pan;
    panStart.current = {
      x: e.clientX - currentPan.x,
      y: e.clientY - currentPan.y,
    };
    hasDragged.current = false;
    e.currentTarget.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isPanning.current) return;
    hasDragged.current = true;
    const newPan = {
      x: e.clientX - panStart.current.x,
      y: e.clientY - panStart.current.y,
    };
    if (isFullscreen) {
      setFullscreenPan(newPan);
    } else {
      setPan(newPan);
    }
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    if (!isPanning.current) return;
    isPanning.current = false;
    e.currentTarget.style.cursor = "grab";
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const scaleAmount = -e.deltaY * 0.001;
    if (isFullscreen) {
      const newScale = Math.min(
        Math.max(fullscreenScale + scaleAmount, 0.2),
        4
      );
      const newPanX =
        mouseX - ((mouseX - fullscreenPan.x) / fullscreenScale) * newScale;
      const newPanY =
        mouseY - ((mouseY - fullscreenPan.y) / fullscreenScale) * newScale;
      setFullscreenScale(newScale);
      setFullscreenPan({ x: newPanX, y: newPanY });
    } else {
      const newScale = Math.min(Math.max(scale + scaleAmount, 0.2), 4);
      const newPanX = mouseX - ((mouseX - pan.x) / scale) * newScale;
      const newPanY = mouseY - ((mouseY - pan.y) / scale) * newScale;
      setScale(newScale);
      setPan({ x: newPanX, y: newPanY });
    }
  };

  const handleNodeClick = (node: Node) => {
    if (hasDragged.current) return;
    setTooltip({ nodeId: node.id });
  };

  const handleBackdropClick = () => {
    if (!hasDragged.current) {
      setTooltip(null);
    }
  };

  const getTooltipPosition = () => {
    if (!tooltip || !wrapperRef.current) return null;
    const node = nodeMap.get(tooltip.nodeId);
    if (!node) return null;
    const rect = wrapperRef.current.getBoundingClientRect();
    const activeScale = isFullscreen ? fullscreenScale : scale;
    const activePan = isFullscreen ? fullscreenPan : pan;
    let screenX = node.x * activeScale + activePan.x + rect.left;
    let screenY =
      node.y * activeScale + activePan.y + rect.top + TOOLTIP_OFFSET;
    const tooltipHeight = 150;
    screenX = Math.max(
      rect.left,
      Math.min(screenX, rect.right - TOOLTIP_WIDTH)
    );
    screenY = Math.max(
      rect.top,
      Math.min(screenY, rect.bottom - tooltipHeight)
    );
    return { x: screenX, y: screenY, commit: node.commitData };
  };

  const tooltipPosition = getTooltipPosition();

  const branchTreeContent = (
    <div className={styles.container}>
      {" "}
      <div className={styles.branchInfo}>branch: {head.name}</div>{" "}
      {isFullscreen ? (
        <button
          className={styles.closeButton}
          onClick={() => setIsFullscreen(false)}
        >
          {" "}
          <CloseIcon />{" "}
        </button>
      ) : (
        <button
          className={styles.fullscreenButton}
          onClick={() => {
            setIsEnteringFullscreen(true);
            setIsFullscreen(true);
          }}
        >
          {" "}
          <FullscreenIcon />{" "}
        </button>
      )}{" "}
      <div
        ref={wrapperRef}
        className={styles.graphWrapper}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {" "}
        <div
          className={`${styles.pannableContainer} ${
            isFading ? styles.fading : ""
          }`}
          style={{
            transform: `translate(${
              isFullscreen ? fullscreenPan.x : pan.x
            }px, ${isFullscreen ? fullscreenPan.y : pan.y}px) scale(${
              isFullscreen ? fullscreenScale : scale
            })`,
            visibility: isEnteringFullscreen ? "hidden" : "visible",
          }}
        >
          {" "}
          <svg className={styles.svgCanvas} overflow="visible">
            {" "}
            {edges.map((edge: Edge) => (
              <path
                key={edge.key}
                d={edge.path}
                stroke={edge.color}
                strokeWidth="2"
                fill="none"
              />
            ))}{" "}
          </svg>{" "}
          {labels.map((label: Label) => {
            let style: React.CSSProperties = {};
            if (isVertical) {
              style = { top: `${LABEL_ROW_Y - 15}px`, left: `${label.x}px` };
            } else {
              style = { top: `${label.y}px`, left: `${PADDING_X - 100}px` };
            }
            return (
              <div
                key={label.name}
                className={`${styles.labelWrapper} ${
                  !isVertical ? styles.horizontal : ""
                }`}
                style={style}
              >
                {" "}
                <div
                  className={styles.branchLabel}
                  style={{ backgroundColor: label.color }}
                >
                  {" "}
                  {label.name}{" "}
                </div>{" "}
                {label.isHead && <div className={styles.headLabel}>HEAD</div>}{" "}
              </div>
            );
          })}{" "}
          {nodes.map((node: Node) => {
            const isReversed = node.depth % 2 !== 0;
            const transform = isVertical
              ? isReversed
                ? `translate(calc(-100% + 11px), -50%)`
                : `translate(-11px, -50%)`
              : isReversed
              ? `translate(-50%, calc(-100% + 11px))`
              : `translate(-50%, -11px)`;
            return (
              <div
                key={node.id}
                className={`${styles.commitNodeWrapper} ${
                  !isVertical ? styles.horizontal : ""
                }`}
                style={{
                  top: `${node.y}px`,
                  left: `${node.x}px`,
                  transform,
                  cursor: "pointer",
                }}
                onClick={() => handleNodeClick(node)}
              >
                {" "}
                {isReversed ? (
                  <>
                    {" "}
                    <div className={styles.inlineCommitHash}>
                      {" "}
                      {node.commitData.id}{" "}
                    </div>{" "}
                    <div className={styles.commitLine} />{" "}
                    <div
                      className={styles.commitCircle}
                      style={{ borderColor: node.color }}
                    />{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <div
                      className={styles.commitCircle}
                      style={{ borderColor: node.color }}
                    />{" "}
                    <div className={styles.commitLine} />{" "}
                    <div className={styles.inlineCommitHash}>
                      {" "}
                      {node.commitData.id}{" "}
                    </div>{" "}
                  </>
                )}{" "}
              </div>
            );
          })}{" "}
        </div>{" "}
        {tooltipPosition &&
          createPortal(
            <>
              {" "}
              <div
                className={styles.tooltipBackdrop}
                onClick={handleBackdropClick}
              />{" "}
              <div
                className={styles.tooltip}
                style={{
                  top: `${tooltipPosition.y}px`,
                  left: `${tooltipPosition.x}px`,
                }}
              >
                {" "}
                <h4 className={styles.tooltipHeader}>Commit Details</h4>{" "}
                <div className={styles.tooltipRow}>
                  {" "}
                  <strong>Hash:</strong> {tooltipPosition.commit.id}{" "}
                </div>{" "}
                <div className={styles.tooltipRow}>
                  {" "}
                  <strong>Message:</strong> {tooltipPosition.commit.message}{" "}
                </div>{" "}
                <div className={styles.tooltipRow}>
                  {" "}
                  <strong>Files Changed:</strong>{" "}
                  <ul>
                    {" "}
                    {tooltipPosition.commit.files.map((file) => (
                      <li key={file.id}>{file.name}</li>
                    ))}{" "}
                  </ul>{" "}
                </div>{" "}
              </div>{" "}
            </>,
            document.body
          )}{" "}
      </div>{" "}
      {isFullscreen && (
        <ControlsPanel
          orientation={orientation}
          setOrientation={setOrientation}
          onRotate={handleRotateRequest}
        />
      )}{" "}
    </div>
  );

  if (isFullscreen) {
    return createPortal(
      <div className={styles.modalOverlay}>
        <div className={styles.modalContentWrapper}>{branchTreeContent}</div>
      </div>,
      document.body
    );
  }

  return branchTreeContent;
};
