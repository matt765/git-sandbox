import { create } from "zustand";
import { largeExampleGitData } from "@/data/largeExampleGitData";

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
  position: number;
}
export interface TerminalLine {
  type: "input" | "output" | "error";
  content: string;
}
interface GitState {
  commits: Record<string, Commit>;
  branches: Record<string, Branch>;
  HEAD: { type: "branch"; name: string };
  logs: string[];
  workingDirectory: GitFile[];
  stagingArea: GitFile[];
  terminalHistory: TerminalLine[];
  isTerminalOpen: boolean;
  commandHistory: string[];
  shouldResetBranchTree?: boolean;
}

interface CommandResult {
  success: boolean;
  message: string;
}

interface GitActions {
  commit: (message: string) => void;
  stageFile: (id: number) => void;
  unstageFile: (id: number) => void;
  addFile: () => void;
  resetApp: () => void;
  loadExample: () => void;
  resetBranchTreePosition: () => void;
  stageAllFiles: () => void;
  unstageAllFiles: () => void;
  discardAllChanges: () => void;
  cherryPick: (commitId: string) => void;
  revert: (commitId: string) => void;
  reset: (commitId: string, mode: "soft" | "mixed" | "hard") => void;
  amend: (newMessage?: string) => void;
  merge: (sourceBranch: string) => void;
  rebase: (targetBranch: string) => void;
  createBranch: (name: string) => void;
  deleteBranch: (name: string) => void;
  renameBranch: (oldName: string, newName: string) => void;
  switchBranch: (name: string) => void;
  executeCommand: (command: string) => CommandResult;
  executeTerminalCommand: (command: string) => void;
  openTerminal: () => void;
  closeTerminal: () => void;
  addCommandToHistory: (command: string) => void;
  clearTerminalHistory: () => void;
}

// --- HELPER FUNCTIONS ---
const generateHash = () => Math.random().toString(36).substring(2, 8);
let fileIdCounter = 7;

// --- INITIAL STATE ---
const welcomeMessage = {
  type: "output",
  content: "Welcome to the interactive Git terminal!",
} as TerminalLine;

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
    main: { name: "main", commitId: "a568e1", position: 0 },
    feature: { name: "feature", commitId: "d8e9f0", position: 1 },
  },
  HEAD: { type: "branch", name: "feature" },
  logs: [
    "Initialized empty Git repository",
    "Switched to a new branch 'feature'",
  ],
  workingDirectory: [{ id: 6, name: "utils.ts" }],
  stagingArea: [{ id: 7, name: "api.ts" }],
  terminalHistory: [welcomeMessage],
  isTerminalOpen: false,
  commandHistory: [],
};

// --- STORE ---
export const useGitStore = create<GitState & GitActions>((set, get) => ({
  ...initialState,

  openTerminal: () => set({ isTerminalOpen: true }),
  closeTerminal: () => set({ isTerminalOpen: false }),

  addCommandToHistory: (command: string) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;
    set((state) => {
      if (state.commandHistory[0] === trimmedCommand) {
        return { commandHistory: state.commandHistory };
      }
      return { commandHistory: [trimmedCommand, ...state.commandHistory] };
    });
  },

  clearTerminalHistory: () => {
    set({ terminalHistory: [welcomeMessage] });
  },

  executeCommand: (command: string): CommandResult => {
    const {
      commit,
      stageAllFiles,
      stageFile,
      unstageFile,
      workingDirectory,
      stagingArea,
      createBranch,
      deleteBranch,
      switchBranch,
      merge,
      revert,
      reset,
      cherryPick,
      amend,
      branches,
      commits,
    } = get();

    const logCommandSuccess = (message: string) => {
      set((state) => ({ logs: [...state.logs, message] }));
    };

    const trimmedCommand = command.trim();

    if (!trimmedCommand) {
      return { success: false, message: "Error: Command cannot be empty." };
    }

    const doubleQuoteCount = (trimmedCommand.match(/"/g) || []).length;
    if (doubleQuoteCount % 2 !== 0) {
      return { success: false, message: "Error: unterminated quote." };
    }

    // --- FIX: Changed ! to ?. to prevent crash on non-git commands ---
    if ((trimmedCommand.match(/git/g)?.length ?? 0) > 1) {
      return {
        success: false,
        message: "Error: Only one git command can be run at a time.",
      };
    }

    if (!trimmedCommand.startsWith("git")) {
      return {
        success: false,
        message: "Error: Command must start with 'git'",
      };
    }

    const parts = trimmedCommand.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    const [, subCommand, ...args] = parts;

    if (!subCommand) {
      return { success: false, message: "Usage: git <command> [<args>]" };
    }

    const arg1 = args[0]?.replace(/^['"]|['"]$/g, "");
    const arg2 = args[1]?.replace(/^['"]|['"]$/g, "");

    let result: CommandResult;

    switch (subCommand) {
      case "add": {
        if (!arg1) {
          result = {
            success: false,
            message:
              'Error: Nothing specified, nothing added. Did you mean "git add ."?',
          };
          break;
        }
        if (arg1 === ".") {
          if (get().workingDirectory.length === 0) {
            result = {
              success: true,
              message: "Nothing to add, working directory clean.",
            };
            break;
          }
          stageAllFiles();
          result = { success: true, message: "Staged all changes." };
          break;
        }
        const file = workingDirectory.find((f) => f.name === arg1);
        if (file) {
          stageFile(file.id);
          result = { success: true, message: `Staged '${arg1}'.` };
          break;
        }
        result = {
          success: false,
          message: `Error: pathspec '${arg1}' did not match any file(s).`,
        };
        break;
      }
      case "remove":
      case "unstage": {
        if (!arg1) {
          result = { success: false, message: "Error: no file specified." };
          break;
        }
        const fileToUnstage = stagingArea.find((f) => f.name === arg1);
        if (fileToUnstage) {
          unstageFile(fileToUnstage.id);
          result = { success: true, message: `Unstaged '${arg1}'.` };
          break;
        }
        result = {
          success: false,
          message: `Error: '${arg1}' is not in the staging area.`,
        };
        break;
      }
      case "commit": {
        const amendIndex = args.indexOf("--amend");
        if (amendIndex !== -1) {
          const mIndex = args.indexOf("-m");
          const newMessage =
            mIndex !== -1
              ? args[mIndex + 1]?.replace(/^['"]|['"]$/g, "")
              : undefined;

          const headCommitId = branches[get().HEAD.name].commitId;
          const headCommit = commits[headCommitId];
          if (!headCommit.parent) {
            result = {
              success: false,
              message: "Error: You are at the initial commit, cannot amend.",
            };
            break;
          }

          amend(newMessage);
          result = { success: true, message: "Commit amended." };
          break;
        }

        const mIndex = args.indexOf("-m");
        const messageArg = args[mIndex + 1];
        if (!messageArg) {
          result = {
            success: false,
            message: "Error: Missing commit message. Use -m flag.",
          };
          break;
        }
        const message = messageArg.replace(/^['"]|['"]$/g, "");
        if (!message.trim()) {
          result = {
            success: false,
            message: "Error: Aborting commit due to empty commit message.",
          };
          break;
        }
        if (stagingArea.length === 0) {
          result = { success: false, message: "Error: Nothing to commit." };
          break;
        }
        commit(message);
        result = { success: true, message: "Commit successful." };
        break;
      }
      case "branch": {
        if (!arg1) {
          result = {
            success: false,
            message: "Error: Branch name not specified.",
          };
          break;
        }
        if (arg1 === "-d" && arg2) {
          if (arg2 === "main") {
            result = {
              success: false,
              message: "Error: The 'main' branch cannot be deleted.",
            };
            break;
          }
          if (!branches[arg2]) {
            result = {
              success: false,
              message: `Error: branch '${arg2}' not found.`,
            };
            break;
          }
          deleteBranch(arg2);
          result = { success: true, message: `Deleted branch '${arg2}'.` };
          break;
        }
        if (branches[arg1]) {
          result = {
            success: false,
            message: `Error: A branch named '${arg1}' already exists.`,
          };
          break;
        }
        createBranch(arg1);
        result = { success: true, message: `Created branch '${arg1}'.` };
        break;
      }
      case "switch":
      case "checkout": {
        if (!arg1) {
          result = {
            success: false,
            message: "Error: Branch name not specified.",
          };
          break;
        }
        if (arg1 === "-c" && arg2) {
          if (branches[arg2]) {
            result = {
              success: false,
              message: `Error: A branch named '${arg2}' already exists.`,
            };
            break;
          }
          createBranch(arg2);
          switchBranch(arg2);
          result = {
            success: true,
            message: `Switched to a new branch '${arg2}'.`,
          };
          break;
        }
        if (!branches[arg1]) {
          result = {
            success: false,
            message: `Error: pathspec '${arg1}' did not match any file(s).`,
          };
          break;
        }
        switchBranch(arg1);
        result = { success: true, message: `Switched to branch '${arg1}'.` };
        break;
      }
      case "merge": {
        if (!arg1) {
          result = {
            success: false,
            message: "Error: Branch to merge not specified.",
          };
          break;
        }
        if (!branches[arg1]) {
          result = {
            success: false,
            message: `Error: '${arg1}' does not point to a branch.`,
          };
          break;
        }
        merge(arg1);
        result = { success: true, message: `Merged branch '${arg1}'.` };
        break;
      }
      case "revert": {
        if (!arg1) {
          result = {
            success: false,
            message: "Error: Commit to revert not specified.",
          };
          break;
        }
        if (!commits[arg1]) {
          result = { success: false, message: `Error: bad revision '${arg1}'` };
          break;
        }
        revert(arg1);
        result = { success: true, message: `Reverted commit ${arg1}.` };
        break;
      }
      case "cherry-pick": {
        if (!arg1) {
          result = {
            success: false,
            message: "Error: Commit to cherry-pick not specified.",
          };
          break;
        }
        if (!commits[arg1]) {
          result = { success: false, message: `Error: bad revision '${arg1}'` };
          break;
        }
        cherryPick(arg1);
        result = { success: true, message: `Cherry-picked commit ${arg1}.` };
        break;
      }
      case "reset": {
        const mode = args.find((a) => a.startsWith("--"))?.substring(2) as
          | "soft"
          | "mixed"
          | "hard";
        const commitHash = args.find((a) => !a.startsWith("--"));
        if (!commitHash || !commits[commitHash]) {
          result = {
            success: false,
            message: `Error: bad revision '${commitHash}'`,
          };
          break;
        }
        const validModes = ["soft", "mixed", "hard"];
        if (mode && !validModes.includes(mode)) {
          result = {
            success: false,
            message: `Error: unknown option '${mode}'`,
          };
          break;
        }
        reset(commitHash, mode || "mixed");
        result = { success: true, message: `Reset to ${commitHash}.` };
        break;
      }
      default:
        result = {
          success: false,
          message: `Error: Unknown command 'git ${subCommand}'`,
        };
        break;
    }

    if (
      result.success &&
      result.message !== "Nothing to add, working directory clean."
    ) {
      const selfLoggingCommands = [
        "commit",
        "merge",
        "revert",
        "reset",
        "cherry-pick",
        "branch",
        "switch",
        "checkout",
      ];
      if (!selfLoggingCommands.includes(subCommand)) {
        logCommandSuccess(result.message);
      }
    }

    return result;
  },
  executeTerminalCommand: (command: string) => {
    const { executeCommand, terminalHistory } = get();
    const newHistory = [
      ...terminalHistory,
      { type: "input", content: command } as TerminalLine,
    ];
    const result = executeCommand(command);

    if (result.success) {
      newHistory.push({ type: "output", content: result.message });
    } else {
      newHistory.push({ type: "error", content: result.message });
    }
    set({ terminalHistory: newHistory });
  },

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
    set({ ...initialState, shouldResetBranchTree: true });
  },
  loadExample: () => {
    fileIdCounter = Math.max(
      ...(Object.values(largeExampleGitData.commits) as Commit[]).flatMap((commit: Commit) => 
        commit.files.map((file: GitFile) => file.id)
      ), 
      ...largeExampleGitData.workingDirectory.map((file: GitFile) => file.id), 
      ...largeExampleGitData.stagingArea.map((file: GitFile) => file.id)
    ) + 1;
    set({ ...largeExampleGitData, shouldResetBranchTree: false });
  },
  resetBranchTreePosition: () => {
    set({ shouldResetBranchTree: false });
  },
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
    const revertedParentCommit = revertedCommit.parent
      ? state.commits[
          Array.isArray(revertedCommit.parent)
            ? revertedCommit.parent[0]
            : revertedCommit.parent
        ]
      : null;
    let revertedFiles: GitFile[];
    if (revertedParentCommit) {
      const currentFileIds = new Set(currentCommit.files.map((f) => f.id));
      const revertedFileIds = new Set(revertedCommit.files.map((f) => f.id));
      const revertedParentFileIds = new Set(
        revertedParentCommit.files.map((f) => f.id)
      );
      let resultFiles = [...currentCommit.files];
      const addedByReverted = revertedCommit.files.filter(
        (f) => !revertedParentFileIds.has(f.id)
      );
      resultFiles = resultFiles.filter(
        (f) => !addedByReverted.some((af) => af.id === f.id)
      );
      const removedByReverted = revertedParentCommit.files.filter(
        (f) => !revertedFileIds.has(f.id)
      );
      resultFiles = [
        ...resultFiles,
        ...removedByReverted.filter((f) => !currentFileIds.has(f.id)),
      ];
      revertedFiles = resultFiles;
    } else {
      const revertedFileIds = new Set(revertedCommit.files.map((f) => f.id));
      revertedFiles = currentCommit.files.filter(
        (f) => !revertedFileIds.has(f.id)
      );
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
    set((state) => {
      if (!state.commits[commitId]) return {};
      const newBranchState = {
        ...state.branches[state.HEAD.name],
        commitId: commitId,
      };
      const newState: Partial<GitState> = {
        branches: { ...state.branches, [state.HEAD.name]: newBranchState },
        logs: [...state.logs, `Reset current branch to ${commitId} (${mode})`],
      };
      if (mode === "mixed" || mode === "hard") {
        const filesToUnstage = [...state.stagingArea];
        newState.stagingArea = [];
        if (mode === "mixed") {
          const oldHeadCommitId = state.branches[state.HEAD.name].commitId;
          const changesToApply: GitFile[] = [];
          let currentCommitId: string | null = oldHeadCommitId;
          while (currentCommitId && currentCommitId !== commitId) {
            const currentCommit: Commit | undefined =
              state.commits[currentCommitId];
            if (!currentCommit) break;
            changesToApply.push(...currentCommit.files);
            const parent: string | string[] | null = currentCommit.parent;
            currentCommitId = Array.isArray(parent) ? parent[0] : parent;
          }
          const combinedFiles = [
            ...state.workingDirectory,
            ...filesToUnstage,
            ...changesToApply,
          ];
          newState.workingDirectory = Array.from(
            new Map(combinedFiles.map((file) => [file.id, file])).values()
          );
        }
      }
      if (mode === "hard") {
        newState.workingDirectory = [];
        newState.stagingArea = [];
      }
      return newState;
    });
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [oldCommitId]: _removedCommit, ...remainingCommits } =
      state.commits;
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
  merge: (sourceBranch: string) => {
    const state = get();
    if (!state.branches[sourceBranch] || sourceBranch === state.HEAD.name)
      return;
    const currentCommitId = state.branches[state.HEAD.name].commitId;
    const sourceCommitId = state.branches[sourceBranch].commitId;
    const newCommitId = generateHash();
    const currentCommit = state.commits[currentCommitId];
    const sourceCommit = state.commits[sourceCommitId];
    const allFiles = [...currentCommit.files];
    sourceCommit.files.forEach((sourceFile) => {
      if (!allFiles.some((f) => f.id === sourceFile.id)) {
        allFiles.push(sourceFile);
      }
    });
    const mergeCommit: Commit = {
      id: newCommitId,
      parent: [currentCommitId, sourceCommitId],
      message: `Merge branch '${sourceBranch}' into ${state.HEAD.name}`,
      files: allFiles,
    };
    set({
      commits: { ...state.commits, [newCommitId]: mergeCommit },
      branches: {
        ...state.branches,
        [state.HEAD.name]: {
          ...state.branches[state.HEAD.name],
          commitId: newCommitId,
        },
      },
      logs: [
        ...state.logs,
        `Merged branch '${sourceBranch}' into ${state.HEAD.name}`,
      ],
    });
  },
  rebase: (targetBranch: string) => {
    const state = get();
    if (!state.branches[targetBranch] || targetBranch === state.HEAD.name)
      return;
    const targetCommitId = state.branches[targetBranch].commitId;
    set({
      branches: {
        ...state.branches,
        [state.HEAD.name]: {
          ...state.branches[state.HEAD.name],
          commitId: targetCommitId,
        },
      },
      logs: [...state.logs, `Rebased ${state.HEAD.name} onto ${targetBranch}`],
    });
  },
  createBranch: (name: string) => {
    const state = get();
    if (state.branches[name]) return;
    
    const currentCommitId = state.branches[state.HEAD.name].commitId;
    const existingPositions = new Set(
      Object.values(state.branches).map((b) => b.position)
    );
    let nextPosition = 0;
    while (existingPositions.has(nextPosition)) {
      nextPosition++;
    }
    
    // Create a new commit for the new branch
    const newCommitId = generateHash();
    const newCommit: Commit = {
      id: newCommitId,
      message: `Initial commit on ${name}`,
      parent: currentCommitId,
      files: [],
    };
    
    set({
      commits: {
        ...state.commits,
        [newCommitId]: newCommit,
      },
      branches: {
        ...state.branches,
        [name]: { name, commitId: newCommitId, position: nextPosition },
      },
      logs: [...state.logs, `Created branch '${name}' with initial commit`],
    });
  },
  deleteBranch: (name: string) => {
    const state = get();
    if (!state.branches[name] || name === state.HEAD.name) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [name]: _deletedBranch, ...remainingBranches } = state.branches;
    set({
      branches: remainingBranches,
      logs: [...state.logs, `Deleted branch '${name}'`],
    });
  },
  renameBranch: (oldName: string, newName: string) => {
    const state = get();
    if (!state.branches[oldName] || state.branches[newName] || oldName === newName) return;
    
    const branchToRename = state.branches[oldName];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [oldName]: _oldBranch, ...remainingBranches } = state.branches;
    
    const newBranches = {
      ...remainingBranches,
      [newName]: { ...branchToRename, name: newName },
    };
    
    const newHEAD = state.HEAD.name === oldName 
      ? { type: "branch" as const, name: newName }
      : state.HEAD;
    
    set({
      branches: newBranches,
      HEAD: newHEAD,
      logs: [...state.logs, `Renamed branch '${oldName}' to '${newName}'`],
    });
  },
  switchBranch: (name: string) => {
    const state = get();
    if (!state.branches[name] || name === state.HEAD.name) return;
    set({
      HEAD: { type: "branch", name },
      logs: [...state.logs, `Switched to branch '${name}'`],
    });
  },
}));
