// src/store/gitStore.ts
import { create } from "zustand";

// --- INTERFACES ---
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
}

// --- HELPER FUNCTIONS ---
const generateHash = () => Math.random().toString(36).substring(2, 8);
let fileIdCounter = 7;

// --- INITIAL STATE ---
const initialState: GitState = {
  // ... (reszta stanu bez zmian)
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
}));
