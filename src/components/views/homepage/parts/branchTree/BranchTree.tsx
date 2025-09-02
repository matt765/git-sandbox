// src/components/views/homepage/parts/branchTree/BranchTree.tsx
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

// --- INTERFACES --- (bez zmian)
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
  x: number;
  y: number;
  commit: Commit;
}

const Y_STEP = 80;
const X_STEP = 150;
const PADDING_X = 150;
const PADDING_Y = 100;
const LABEL_ROW_Y = 40;
const GRAY_COLOR = "#4a5568";

const LANE_COLORS = ["#38b2ac", "#a78bfa", "#f6ad55", "#ec4899"];

export const BranchTree = () => {
  const commits = useGitStore((state) => state.commits);
  const branches = useGitStore((state) => state.branches);
  const head = useGitStore((state) => state.HEAD);

  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  useEffect(() => {
    if (wrapperRef.current) {
      const wrapperWidth = wrapperRef.current.offsetWidth;
      const numLanes = Object.keys(branches).length;
      const contentWidth = PADDING_X + numLanes * X_STEP;

      const initialX = (wrapperWidth - contentWidth) / 2;
      setPan({ x: initialX, y: 40 });
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { nodes, edges, labels } = useMemo(() => {
    const branchNames = Object.keys(branches);

    const sortedBranchNames = [...branchNames].sort((a, b) => {
      return branches[a].position - branches[b].position;
    });

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
    const nodeMap = new Map<string, Node>();
    const calculatedNodes: Node[] = [];

    const commitToBranch = new Map<string, string>();

    if (branches.main) {
      let currentId: string | null = branches.main.commitId;
      while (currentId && commits[currentId]) {
        if (!commitToBranch.has(currentId)) {
          commitToBranch.set(currentId, "main");
        }
        const parent: string | string[] | null | undefined =
          commits[currentId]?.parent;
        currentId = Array.isArray(parent) ? parent[0] : parent ?? null;
      }
    }

    sortedBranchNames.forEach((branchName) => {
      if (branchName === "main") return;

      let currentId: string | null = branches[branchName].commitId;
      while (currentId && commits[currentId]) {
        if (!commitToBranch.has(currentId)) {
          commitToBranch.set(currentId, branchName);
        }
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
        x: PADDING_X + lane * X_STEP,
        y: PADDING_Y + depth * Y_STEP,
        color: colorAssignments.get(branchName) ?? LANE_COLORS[0],
        depth: depth,
        commitData: commit,
      };
      calculatedNodes.push(node);
      nodeMap.set(commit.id, node);
    });
    const calculatedLabels: Label[] = sortedBranchNames.map((name) => {
      const commitId = branches[name].commitId;
      const lane = laneAssignments.get(name) ?? 0;
      const x = PADDING_X + lane * X_STEP;
      return {
        name,
        x,
        y: LABEL_ROW_Y,
        color: colorAssignments.get(name) ?? LANE_COLORS[0],
        isHead: head.type === "branch" && head.name === name,
        commitId,
      };
    });
    const calculatedEdges: Edge[] = [];

    sortedBranchNames.forEach((branchName) => {
      const branchCommitId = branches[branchName].commitId;
      const existingNode = nodeMap.get(branchCommitId);

      if (existingNode && commitToBranch.get(branchCommitId) !== branchName) {
        const lane = laneAssignments.get(branchName) ?? 0;
        const markerNode: Node = {
          id: `${branchName}-marker-${branchCommitId}`,
          message: existingNode.message,
          x: PADDING_X + lane * X_STEP,
          y: existingNode.y,
          color: colorAssignments.get(branchName) ?? LANE_COLORS[0],
          depth: existingNode.depth,
          commitData: existingNode.commitData,
        };
        calculatedNodes.push(markerNode);

        if (existingNode.x !== markerNode.x) {
          calculatedEdges.push({
            key: `branch-connection-${branchName}-${branchCommitId}`,
            path: `M ${existingNode.x} ${existingNode.y} L ${markerNode.x} ${markerNode.y}`,
            color: colorAssignments.get(branchName) ?? LANE_COLORS[0],
          });
        }
      }
    });

    const lanes = new Map<number, Node[]>();
    calculatedNodes.forEach((node) => {
      if (!lanes.has(node.x)) lanes.set(node.x, []);
      lanes.get(node.x)!.push(node);
    });
    lanes.forEach((nodesOnLane) => {
      nodesOnLane.sort((a, b) => a.y - b.y);
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
        if (nodeMap.has(commit.id) && nodeMap.has(parentId)) {
          const childNode = nodeMap.get(commit.id)!;
          const parentNode = nodeMap.get(parentId)!;
          let path;
          if (childNode.x === parentNode.x) {
            path = `M ${parentNode.x} ${parentNode.y} L ${childNode.x} ${childNode.y}`;
          } else {
            path = `M ${parentNode.x} ${parentNode.y} C ${parentNode.x} ${
              parentNode.y + Y_STEP / 2
            }, ${childNode.x} ${childNode.y - Y_STEP / 2}, ${childNode.x} ${
              childNode.y
            }`;
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
      const nodesOnLane = (lanes.get(label.x) || []).sort((a, b) => a.y - b.y);
      if (nodesOnLane.length > 0) {
        const firstNode = nodesOnLane[0];
        const color = firstNode.depth === 0 ? label.color : GRAY_COLOR;
        calculatedEdges.push({
          key: `label-trunk-${label.name}`,
          path: `M ${label.x} ${label.y + 15} L ${firstNode.x} ${firstNode.y}`,
          color: color,
        });
      }
    });
    return {
      nodes: calculatedNodes,
      edges: calculatedEdges,
      labels: calculatedLabels,
    };
  }, [commits, branches, head]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    isPanning.current = true;
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    hasDragged.current = false;
    e.currentTarget.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isPanning.current) return;
    hasDragged.current = true;
    setPan({
      x: e.clientX - panStart.current.x,
      y: e.clientY - panStart.current.y,
    });
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    if (!isPanning.current) return;
    isPanning.current = false;
    e.currentTarget.style.cursor = "grab";
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const scaleAmount = -e.deltaY * 0.001;
    setScale((prevScale) =>
      Math.min(Math.max(prevScale + scaleAmount, 0.2), 2)
    );
  };

  const handleNodeClick = (node: Node) => {
    if (hasDragged.current) return;
    setTooltip({ x: node.x, y: node.y, commit: node.commitData });
  };

  return (
    <div className={styles.container}>
      <div className={styles.branchInfo}>branch: {head.name}</div> 
      <div
        ref={wrapperRef}
        className={styles.graphWrapper}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className={styles.pannableContainer}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          }}
        >
          <svg className={styles.svgCanvas} overflow="visible">
            {edges.map((edge) => (
              <path
                key={edge.key}
                d={edge.path}
                stroke={edge.color}
                strokeWidth="2"
                fill="none"
              />
            ))}
          </svg>
          {labels.map((label) => (
            <div
              key={label.name}
              className={styles.labelWrapper}
              style={{ top: `${label.y - 15}px`, left: `${label.x}px` }}
            >
              <div
                className={styles.branchLabel}
                style={{ backgroundColor: label.color }}
              >
                {label.name} 
              </div>
              {label.isHead && <div className={styles.headLabel}>HEAD</div>} 
            </div>
          ))}
          {nodes.map((node) => {
            const isReversed = node.depth % 2 !== 0;
            const transform = isReversed
              ? `translate(calc(-100% + 11px), -50%)`
              : `translate(-11px, -50%)`;
            return (
              <div
                key={node.id}
                className={styles.commitNodeWrapper}
                style={{
                  top: `${node.y}px`,
                  left: `${node.x}px`,
                  transform: transform,
                  cursor: "pointer",
                }}
                onClick={() => handleNodeClick(node)}
              >
                {isReversed ? (
                  <>
                    <div className={styles.inlineCommitHash}>{node.id}</div>
                    <div className={styles.commitLine} /> 
                    <div
                      className={styles.commitCircle}
                      style={{ borderColor: node.color }}
                    />
                  </>
                ) : (
                  <>
                    <div
                      className={styles.commitCircle}
                      style={{ borderColor: node.color }}
                    />
                    <div className={styles.commitLine} /> 
                    <div className={styles.inlineCommitHash}>{node.id}</div> 
                  </>
                )}
              </div>
            );
          })}
        </div>
        {tooltip && (
          <>
            <div
              className={styles.tooltipBackdrop}
              onClick={() => setTooltip(null)}
            />
            <div
              className={styles.tooltip}
              style={{
                top: `${tooltip.y * scale + pan.y + 20}px`,
                left: `${tooltip.x * scale + pan.x}px`,
              }}
            >
              <div className={styles.tooltipHeader}>Commit Details</div> 
              <div className={styles.tooltipRow}>
                <strong>Hash:</strong> {tooltip.commit.id} 
              </div>
              <div className={styles.tooltipRow}>
                <strong>Message:</strong> {tooltip.commit.message} 
              </div>
              <div className={styles.tooltipRow}>
                <strong>Files Changed:</strong> 
                <ul>
                  {tooltip.commit.files.map((file) => (
                    <li key={file.id}>{file.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
