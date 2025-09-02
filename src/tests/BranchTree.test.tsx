// src/tests/BranchTree.test.tsx
import { render, screen, act, within, fireEvent } from "@testing-library/react"; // Dodano import fireEvent
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { BranchTree } from "@/components/views/homepage/parts/branchTree/BranchTree";
import { useGitStore } from "@/store/gitStore";
import { Providers } from "@/services/Providers";

const customRender = (ui: ReactNode) => {
  return render(<Providers>{ui}</Providers>);
};

const getElementBackgroundColor = (element: HTMLElement) => {
  return window.getComputedStyle(element).backgroundColor;
};

describe("BranchTree Component Rendering and Interactions", () => {
  beforeEach(() => {
    act(() => {
      useGitStore.getState().resetApp();
    });
  });

  describe("Initial Rendering", () => {
    it("should render initial branches, commits, and HEAD correctly", () => {
      customRender(<BranchTree />);

      expect(screen.getByText("main")).toBeInTheDocument();
      expect(screen.getByText("feature")).toBeInTheDocument();

      const headIndicator = screen.getByText("HEAD");
      const headWrapper = headIndicator.closest(
        'div[class*="labelWrapper"]'
      ) as HTMLElement;
      expect(within(headWrapper!).getByText("feature")).toBeInTheDocument();

      expect(screen.getByText("d8e9f0")).toBeInTheDocument();
      expect(screen.getByText("a568e1")).toBeInTheDocument();
      expect(screen.getByText("f9821b")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should display a tooltip with commit details on node click", async () => {
      customRender(<BranchTree />);

      const commitNode = screen.getByText("c4553b");

      // POPRAWKA: Używamy fireEvent.click(), aby uniknąć symulacji przeciągania
      fireEvent.click(commitNode);

      const tooltip = await screen.findByRole("heading", {
        name: /Commit Details/i,
      });
      expect(tooltip).toBeInTheDocument();

      const tooltipContainer = tooltip.parentElement as HTMLElement;
      expect(within(tooltipContainer).getByText(/c4553b/)).toBeInTheDocument();
      expect(
        within(tooltipContainer).getByText(/Begin feature implementation/)
      ).toBeInTheDocument();
    });
  });

  describe("Responsiveness to Git Actions", () => {
    it("should render a new commit and move the HEAD label", () => {
      customRender(<BranchTree />);

      const newMessage = "New feature commit";
      let newCommitId = "";

      act(() => {
        // W stanie początkowym Staging Area ma pliki, więc możemy commitować
        useGitStore.getState().commit(newMessage);
        const state = useGitStore.getState();
        newCommitId = state.branches.feature.commitId;
      });

      expect(screen.getByText(newCommitId)).toBeInTheDocument();

      const headIndicator = screen.getByText("HEAD");
      const headWrapper = headIndicator.closest(
        'div[class*="labelWrapper"]'
      ) as HTMLElement;
      expect(within(headWrapper!).getByText("feature")).toBeInTheDocument();
    });

    it("should display a new branch label at the correct commit", () => {
      customRender(<BranchTree />);

      act(() => {
        useGitStore.getState().createBranch("fix/bug-123");
      });

      const newBranchLabel = screen.getByText("fix/bug-123");
      expect(newBranchLabel).toBeInTheDocument();
    });

    it("should remove a branch label when a branch is deleted", () => {
      customRender(<BranchTree />);
      expect(screen.getByText("main")).toBeInTheDocument();
      act(() => {
        useGitStore.getState().deleteBranch("main");
      });
      expect(screen.queryByText("main")).not.toBeInTheDocument();
    });

    it("should correctly render a merge commit", () => {
      customRender(<BranchTree />);
      let mergeCommitId = "";
      act(() => {
        const { switchBranch, stageAllFiles, commit, merge } =
          useGitStore.getState();
        switchBranch("main");
        stageAllFiles(); // Dodajemy pliki do staging, żeby móc commitować
        commit("Update main before merge");
        merge("feature");
        mergeCommitId = useGitStore.getState().branches.main.commitId;
      });
      expect(screen.getByText(mergeCommitId)).toBeInTheDocument();
      const mainLabel = screen.getByText("main");
      const headLabel = screen.getByText("HEAD");
      expect(mainLabel.parentElement).toBe(headLabel.parentElement);
    });

    it("should correctly render an abandoned commit after a reset", () => {
      customRender(<BranchTree />);
      const abandonedCommitId = "d8e9f0";
      expect(screen.getByText(abandonedCommitId)).toBeInTheDocument();
      act(() => {
        useGitStore.getState().reset("c4553b", "hard");
      });
      const featureLabel = screen.getByText("feature");
      const featureWrapper = featureLabel.closest(
        'div[class*="labelWrapper"]'
      ) as HTMLElement;
      expect(featureWrapper).toBe(
        screen.getByText("HEAD").closest('div[class*="labelWrapper"]')
      );
      expect(screen.getByText(abandonedCommitId)).toBeInTheDocument();
    });

    it("should handle more branches than available colors by cycling them", () => {
      customRender(<BranchTree />);
      act(() => {
        const { createBranch } = useGitStore.getState();
        createBranch("dev");
        createBranch("staging");
        createBranch("release");
      });
      const mainLabel = screen.getByText("main");
      const releaseLabel = screen.getByText("release");
      expect(getElementBackgroundColor(mainLabel)).toBe(
        getElementBackgroundColor(releaseLabel)
      );
      const featureLabel = screen.getByText("feature");
      expect(getElementBackgroundColor(mainLabel)).not.toBe(
        getElementBackgroundColor(featureLabel)
      );
    });
  });
});
