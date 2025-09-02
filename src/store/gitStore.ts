// src/store/gitStore.ts
import { create } from "zustand";

// --- INTERFACES --- (bez zmian)
export interface GitFile {
  id: number;
  name: string;
}
export interface Commit {
  id: string;
  parent: string | string[] | null;
  message: string;
  files: GitFile[];
}
interface Branch {
  name: string;
  commitId: string;
}
interface GitState {
  commits: Record<string, Commit>;
  branches: Record<string, Branch>;
  HEAD: { type: "branch"; name: string };
  logs: string[];
  workingDirectory: GitFile[];
  stagingArea: GitFile[];
}

interface GitActions {
  commit: (message: string) => void;
  stageFile: (id: number) => void;
  unstageFile: (id: number) => void;
  addFile: () => void;
  resetApp: () => void;
  stageAllFiles: () => void;
  unstageAllFiles: () => void;
  discardAllChanges: () => void;
  // Nowe akcje
  cherryPick: (commitId: string) => void;
  revert: (commitId: string) => void;
  reset: (commitId: string, mode: "soft" | "mixed" | "hard") => void;
  amend: (newMessage?: string) => void;
}

// --- HELPER FUNCTIONS --- (bez zmian)
const generateHash = () => Math.random().toString(36).substring(2, 8);
let fileIdCounter = 7;

// --- INITIAL STATE --- (bez zmian)
const initialState: GitState = {
  commits: {
    f9821b: {
      id: "f9821b",
      parent: null,
      message: "Initial commit",
      files: [{ id: 0, name: "README.md" }],
    },
    "3009a": {
      id: "3009a",
      parent: "f9821b",
      message: "Add project setup",
      files: [{ id: 1, name: "package.json" }],
    },
    "7a19bf": {
      id: "7a19bf",
      parent: "3009a",
      message: "Release version 1.0",
      files: [{ id: 2, name: "index.html" }],
    },
    a568e1: {
      id: "a568e1",
      parent: "7a19bf",
      message: "Refactor main component",
      files: [{ id: 3, name: "Main.tsx" }],
    },
    c4553b: {
      id: "c4553b",
      parent: "7a19bf",
      message: "Begin feature implementation",
      files: [{ id: 4, name: "Login.tsx" }],
    },
    d8e9f0: {
      id: "d8e9f0",
      parent: "c4553b",
      message: "Complete feature logic",
      files: [{ id: 5, name: "Login.css" }],
    },
  },
  branches: {
    main: { name: "main", commitId: "a568e1" },
    feature: { name: "feature", commitId: "d8e9f0" },
  },
  HEAD: { type: "branch", name: "feature" },
  logs: [
    "Initialized empty Git repository",
    "Switched to a new branch 'feature'",
  ],
  workingDirectory: [{ id: 6, name: "utils.ts" }],
  stagingArea: [{ id: 7, name: "api.ts" }],
};

// --- STORE ---
export const useGitStore = create<GitState & GitActions>((set, get) => ({
  ...initialState,

  // --- Istniejące akcje --- (bez zmian)
  commit: (message: string) => {
    const state = get();
    if (!message || state.stagingArea.length === 0) return;
    const parentId = state.branches[state.HEAD.name].commitId;
    const newCommitId = generateHash();
    const newCommit: Commit = {
      id: newCommitId,
      parent: parentId,
      message,
      files: [...state.stagingArea],
    };
    set({
      commits: { ...state.commits, [newCommitId]: newCommit },
      branches: {
        ...state.branches,
        [state.HEAD.name]: {
          ...state.branches[state.HEAD.name],
          commitId: newCommitId,
        },
      },
      stagingArea: [],
      logs: [...state.logs, `Created commit ${newCommitId}: "${message}"`],
    });
  },
  stageFile: (id: number) =>
    set((state) => {
      const fileToStage = state.workingDirectory.find((f) => f.id === id);
      if (!fileToStage) return {};
      return {
        workingDirectory: state.workingDirectory.filter((f) => f.id !== id),
        stagingArea: [...state.stagingArea, fileToStage],
      };
    }),
  unstageFile: (id: number) =>
    set((state) => {
      const fileToUnstage = state.stagingArea.find((f) => f.id === id);
      if (!fileToUnstage) return {};
      return {
        stagingArea: state.stagingArea.filter((f) => f.id !== id),
        workingDirectory: [...state.workingDirectory, fileToUnstage],
      };
    }),
  addFile: () =>
    set((state) => {
      fileIdCounter++;
      const newFile: GitFile = {
        id: fileIdCounter,
        name: `Component-${fileIdCounter}.tsx`,
      };
      return { workingDirectory: [...state.workingDirectory, newFile] };
    }),
  discardAllChanges: () => set({ workingDirectory: [], stagingArea: [] }),
  stageAllFiles: () =>
    set((state) => ({
      stagingArea: [...state.stagingArea, ...state.workingDirectory],
      workingDirectory: [],
    })),
  unstageAllFiles: () =>
    set((state) => ({
      workingDirectory: [...state.workingDirectory, ...state.stagingArea],
      stagingArea: [],
    })),
  resetApp: () => {
    fileIdCounter = 7;
    set(initialState);
  },

  // --- Nowe akcje ---
  cherryPick: (commitId: string) => {
    const state = get();
    const pickedCommit = state.commits[commitId];
    if (!pickedCommit) return;

    const parentId = state.branches[state.HEAD.name].commitId;
    const newCommitId = generateHash();
    const newCommit: Commit = {
      id: newCommitId,
      parent: parentId,
      message: pickedCommit.message,
      files: pickedCommit.files,
    };

    set({
      commits: { ...state.commits, [newCommitId]: newCommit },
      branches: {
        ...state.branches,
        [state.HEAD.name]: {
          ...state.branches[state.HEAD.name],
          commitId: newCommitId,
        },
      },
      logs: [...state.logs, `Cherry-picked commit ${commitId}`],
    });
  },

  revert: (commitId: string) => {
    const state = get();
    const revertedCommit = state.commits[commitId];
    if (!revertedCommit) return;

    const currentCommitId = state.branches[state.HEAD.name].commitId;
    const currentCommit = state.commits[currentCommitId];
    
    // Find what the reverted commit's parent had (to understand what was changed)
    const revertedParentCommit = revertedCommit.parent 
      ? state.commits[Array.isArray(revertedCommit.parent) ? revertedCommit.parent[0] : revertedCommit.parent]
      : null;
    
    let revertedFiles: GitFile[];
    
    if (revertedParentCommit) {
      // Remove files that were added by the reverted commit
      // and restore files that were in the parent but removed by the reverted commit
      const currentFileIds = new Set(currentCommit.files.map(f => f.id));
      const revertedFileIds = new Set(revertedCommit.files.map(f => f.id));
      const revertedParentFileIds = new Set(revertedParentCommit.files.map(f => f.id));
      
      // Start with current files
      let resultFiles = [...currentCommit.files];
      
      // Remove files that were added by the reverted commit (but weren't in its parent)
      const addedByReverted = revertedCommit.files.filter(f => !revertedParentFileIds.has(f.id));
      resultFiles = resultFiles.filter(f => !addedByReverted.some(af => af.id === f.id));
      
      // Add back files that were in the reverted commit's parent but removed by the reverted commit
      const removedByReverted = revertedParentCommit.files.filter(f => !revertedFileIds.has(f.id));
      resultFiles = [...resultFiles, ...removedByReverted.filter(f => !currentFileIds.has(f.id))];
      
      revertedFiles = resultFiles;
    } else {
      // If no parent (initial commit), reverting means removing all files from that commit
      const revertedFileIds = new Set(revertedCommit.files.map(f => f.id));
      revertedFiles = currentCommit.files.filter(f => !revertedFileIds.has(f.id));
    }

    const newCommitId = generateHash();
    const newCommit: Commit = {
      id: newCommitId,
      parent: currentCommitId,
      message: `Revert "${revertedCommit.message}"`,
      files: revertedFiles,
    };

    set({
      commits: { ...state.commits, [newCommitId]: newCommit },
      branches: {
        ...state.branches,
        [state.HEAD.name]: {
          ...state.branches[state.HEAD.name],
          commitId: newCommitId,
        },
      },
      logs: [...state.logs, `Reverted commit ${commitId}`],
    });
  },

  reset: (commitId: string, mode: "soft" | "mixed" | "hard") => {
    const state = get();
    if (!state.commits[commitId]) return;

    const newBranchState = {
      ...state.branches[state.HEAD.name],
      commitId: commitId,
    };

    let newState: Partial<GitState> = {
      branches: { ...state.branches, [state.HEAD.name]: newBranchState },
      logs: [...state.logs, `Reset current branch to ${commitId} (${mode})`],
    };

    if (mode === "mixed" || mode === "hard") {
      newState.stagingArea = [];
    }
    if (mode === "hard") {
      newState.workingDirectory = [];
    }

    set(newState);
  },

  amend: (newMessage?: string) => {
    const state = get();
    const oldCommitId = state.branches[state.HEAD.name].commitId;
    const oldCommit = state.commits[oldCommitId];
    if (!oldCommit) return;

    const newCommitId = generateHash();
    const newCommit: Commit = {
      id: newCommitId,
      parent: oldCommit.parent,
      message: newMessage || oldCommit.message,
      files: [...oldCommit.files, ...state.stagingArea],
    };

    // Remove old commit and add new one
    const { [oldCommitId]: removedCommit, ...remainingCommits } = state.commits;

    set({
      commits: { ...remainingCommits, [newCommitId]: newCommit },
      branches: {
        ...state.branches,
        [state.HEAD.name]: {
          ...state.branches[state.HEAD.name],
          commitId: newCommitId,
        },
      },
      stagingArea: [],
      logs: [...state.logs, `Amended commit ${oldCommitId} -> ${newCommitId}`],
    });
  },
}));
