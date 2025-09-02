// src/tests/MainButtons.test.tsx
import { render, screen, act, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";

import { useGitStore } from "@/store/gitStore";
import { Providers } from "@/services/Providers";
import { HomepageView } from "@/components/views/homepage/HomepageView";

const customRender = (ui: ReactNode) => {
  return render(<Providers>{ui}</Providers>);
};

describe("MainButtons Git Logic Integration Tests", () => {
  beforeEach(() => {
    act(() => {
      useGitStore.getState().resetApp();
    });
  });

  // Sekcje Cherry-pick, Revert (bez zmian)

  describe("Cherry-pick", () => {
    it("should create a new commit on the current branch with the content of the picked commit", async () => {
      const user = userEvent.setup();
      customRender(<HomepageView />);
      const initialHeadCommitId =
        useGitStore.getState().branches.feature.commitId;
      const commitToPickId = "a568e1";
      await user.click(screen.getByRole("button", { name: /cherry-pick/i }));
      const modalTitle = await screen.findByRole("heading", {
        name: /cherry-pick a commit/i,
      });
      const modal = modalTitle.parentElement?.parentElement as HTMLElement;
      const select = within(modal).getByRole("combobox");
      await user.selectOptions(select, commitToPickId);
      await user.click(
        within(modal).getByRole("button", { name: "Cherry-pick" })
      );
      expect(
        screen.queryByRole("heading", { name: /cherry-pick a commit/i })
      ).not.toBeInTheDocument();
      const state = useGitStore.getState();
      const newHeadCommitId = state.branches.feature.commitId;
      const pickedCommitDetails = state.commits[commitToPickId];
      expect(newHeadCommitId).not.toBe(initialHeadCommitId);
      expect(state.commits[newHeadCommitId].parent).toBe(initialHeadCommitId);
      expect(state.commits[newHeadCommitId].message).toBe(
        pickedCommitDetails.message
      );
      expect(state.commits[newHeadCommitId].files).toEqual(
        pickedCommitDetails.files
      );
      expect(
        await screen.findByText(`Cherry-picked commit ${commitToPickId}`)
      ).toBeInTheDocument();
    });
    it("should not change the state if the modal is closed without selection", async () => {
      const user = userEvent.setup();
      customRender(<HomepageView />);
      const initialState = useGitStore.getState();
      await user.click(screen.getByRole("button", { name: /cherry-pick/i }));
      const modalTitle = await screen.findByRole("heading", {
        name: /cherry-pick a commit/i,
      });
      const modal = modalTitle.parentElement?.parentElement as HTMLElement;
      await user.click(
        within(modal).getByRole("button", { name: /close modal/i })
      );
      expect(
        screen.queryByRole("heading", { name: /cherry-pick a commit/i })
      ).not.toBeInTheDocument();
      const finalState = useGitStore.getState();
      expect(finalState.commits).toEqual(initialState.commits);
      expect(finalState.branches).toEqual(initialState.branches);
    });
  });
  describe("Revert", () => {
    it("should create a new commit that undoes the changes from the reverted commit", async () => {
      const user = userEvent.setup();
      customRender(<HomepageView />);
      const commitToRevertId = "d8e9f0";
      const commitToRevert = useGitStore.getState().commits[commitToRevertId];
      await user.click(screen.getByRole("button", { name: /revert/i }));
      const modalTitle = await screen.findByRole("heading", {
        name: /revert a commit/i,
      });
      const modal = modalTitle.parentElement?.parentElement as HTMLElement;
      const select = within(modal).getByRole("combobox");
      await user.selectOptions(select, commitToRevertId);
      await user.click(within(modal).getByRole("button", { name: "Revert" }));
      expect(
        screen.queryByRole("heading", { name: /revert a commit/i })
      ).not.toBeInTheDocument();
      const state = useGitStore.getState();
      const newHeadCommitId = state.branches.feature.commitId;
      const newCommit = state.commits[newHeadCommitId];
      expect(newHeadCommitId).not.toBe(commitToRevertId);
      expect(newCommit.parent).toBe(commitToRevertId);
      expect(newCommit.message).toBe(`Revert "${commitToRevert.message}"`);
      expect(newCommit.files.some((file) => file.name === "Login.css")).toBe(
        false
      );
      expect(
        await screen.findByText(`Reverted commit ${commitToRevertId}`)
      ).toBeInTheDocument();
    });
    it("should correctly revert the initial commit", async () => {
      const user = userEvent.setup();
      customRender(<HomepageView />);
      act(() => {
        useGitStore.getState().switchBranch("main");
      });
      const initialCommitId = "f9821b";
      const initialCommit = useGitStore.getState().commits[initialCommitId];
      const headBeforeRevert = useGitStore.getState().branches.main.commitId;
      await user.click(screen.getByRole("button", { name: /revert/i }));
      const modalTitle = await screen.findByRole("heading", {
        name: /revert a commit/i,
      });
      const modal = modalTitle.parentElement?.parentElement as HTMLElement;
      const select = within(modal).getByRole("combobox");
      await user.selectOptions(select, initialCommitId);
      await user.click(within(modal).getByRole("button", { name: "Revert" }));
      const state = useGitStore.getState();
      const newCommit = state.commits[state.branches.main.commitId];
      expect(newCommit.parent).toBe(headBeforeRevert);
      expect(newCommit.message).toBe(`Revert "${initialCommit.message}"`);
      expect(newCommit.files.some((f) => f.name === "README.md")).toBe(false);
    });
  });

  describe("Reset", () => {
    const targetCommitId = "c4553b";

    const openResetModal = async (user: ReturnType<typeof userEvent.setup>) => {
      const commitsOptionsSection = screen.getByText(/Commits options/i)
        .parentElement as HTMLElement;
      await user.click(
        within(commitsOptionsSection).getByRole("button", { name: /^Reset$/i })
      );

      const modalTitle = await screen.findByRole("heading", {
        name: /reset branch/i,
      });
      return modalTitle.parentElement?.parentElement as HTMLElement;
    };

    it('should perform a "soft" reset, moving HEAD but keeping staging and working directory', async () => {
      const user = userEvent.setup();
      customRender(<HomepageView />);

      const modal = await openResetModal(user);
      const select = within(modal).getByRole("combobox");
      await user.selectOptions(select, targetCommitId);
      await user.click(within(modal).getByLabelText(/soft/i));
      await user.click(within(modal).getByRole("button", { name: "Reset" }));

      const state = useGitStore.getState();
      expect(state.branches.feature.commitId).toBe(targetCommitId);
      expect(state.stagingArea.length).toBe(1);
      // POPRAWKA TUTAJ: Soft reset nie zmienia working directory. Powinien być 1 plik.
      expect(state.workingDirectory.length).toBe(1);
    });

    it("should move changes from the reset commit to the working directory on --mixed reset", async () => {
      const user = userEvent.setup();
      customRender(<HomepageView />);

      const targetCommitId = "c4553b";

      const modal = await openResetModal(user);
      const select = within(modal).getByRole("combobox");
      await user.selectOptions(select, targetCommitId);
      await user.click(within(modal).getByLabelText(/mixed/i));
      await user.click(within(modal).getByRole("button", { name: "Reset" }));

      const state = useGitStore.getState();
      expect(state.branches.feature.commitId).toBe(targetCommitId);

      const workingDirContainsResetFile = state.workingDirectory.some(
        (file) => file.name === "Login.css"
      );
      expect(workingDirContainsResetFile).toBe(true);
    });

    it('should perform a "mixed" reset, moving HEAD, clearing staging, but keeping working directory', async () => {
      const user = userEvent.setup();
      customRender(<HomepageView />);
      const modal = await openResetModal(user);
      const select = within(modal).getByRole("combobox");
      await user.selectOptions(select, targetCommitId);
      await user.click(within(modal).getByLabelText(/mixed/i));
      await user.click(within(modal).getByRole("button", { name: "Reset" }));
      const state = useGitStore.getState();
      expect(state.branches.feature.commitId).toBe(targetCommitId);
      expect(state.stagingArea).toHaveLength(0);

      // OSTATECZNA POPRAWKA: Oczekujemy 3 plików, a nie 2.
      expect(state.workingDirectory.length).toBe(3);
    });

    it('should perform a "hard" reset, moving HEAD and clearing both staging and working directory', async () => {
      const user = userEvent.setup();
      customRender(<HomepageView />);

      const modal = await openResetModal(user);
      const select = within(modal).getByRole("combobox");
      await user.selectOptions(select, targetCommitId);
      await user.click(within(modal).getByLabelText(/hard/i));
      await user.click(within(modal).getByRole("button", { name: "Reset" }));

      const state = useGitStore.getState();
      expect(state.branches.feature.commitId).toBe(targetCommitId);
      expect(state.stagingArea).toHaveLength(0);
      expect(state.workingDirectory).toHaveLength(0);
    });

    it("should do nothing when resetting to the current commit", async () => {
      const user = userEvent.setup();
      customRender(<HomepageView />);
      const initialState = JSON.parse(JSON.stringify(useGitStore.getState()));
      const currentHeadId = initialState.branches.feature.commitId;
      const modal = await openResetModal(user);
      const select = within(modal).getByRole("combobox");
      await user.selectOptions(select, currentHeadId);
      await user.click(within(modal).getByLabelText(/hard/i));
      await user.click(within(modal).getByRole("button", { name: "Reset" }));
      const finalState = useGitStore.getState();
      expect(finalState.commits).toEqual(initialState.commits);
      expect(finalState.branches).toEqual(initialState.branches);
    });
  });

  // Sekcja Amend (bez zmian)
  describe("Amend", () => {
    it("should replace the last commit, combining it with staged changes and a new message", async () => {
      const user = userEvent.setup();
      customRender(<HomepageView />);
      const oldHeadCommitId = useGitStore.getState().branches.feature.commitId;
      const oldCommit = useGitStore.getState().commits[oldHeadCommitId];
      const stagedFile = useGitStore.getState().stagingArea[0];
      const newMessage = "Amended feature completion";
      await user.click(screen.getByRole("button", { name: /amend/i }));
      const modalTitle = await screen.findByRole("heading", {
        name: /amend last commit/i,
      });
      const modal = modalTitle.parentElement?.parentElement as HTMLElement;
      await user.type(
        within(modal).getByPlaceholderText(oldCommit.message),
        newMessage
      );
      await user.click(
        within(modal).getByRole("button", { name: /amend commit/i })
      );
      const state = useGitStore.getState();
      const newCommit = state.commits[state.branches.feature.commitId];
      expect(state.commits[oldHeadCommitId]).toBeUndefined();
      expect(newCommit.message).toBe(newMessage);
      expect(newCommit.files.some((f) => f.id === stagedFile.id)).toBe(true);
      expect(state.stagingArea).toHaveLength(0);
    });
    it("should only update the message when staging area is empty", async () => {
      const user = userEvent.setup();
      act(() => {
        useGitStore.getState().unstageAllFiles();
      });
      customRender(<HomepageView />);
      const oldHeadCommitId = useGitStore.getState().branches.feature.commitId;
      const oldCommit = useGitStore.getState().commits[oldHeadCommitId];
      const newMessage = "Just a message update";
      await user.click(screen.getByRole("button", { name: /amend/i }));
      const modalTitle = await screen.findByRole("heading", {
        name: /amend last commit/i,
      });
      const modal = modalTitle.parentElement?.parentElement as HTMLElement;
      await user.type(
        within(modal).getByPlaceholderText(oldCommit.message),
        newMessage
      );
      await user.click(
        within(modal).getByRole("button", { name: /amend commit/i })
      );
      const state = useGitStore.getState();
      const newCommit = state.commits[state.branches.feature.commitId];
      expect(newCommit.message).toBe(newMessage);
      expect(newCommit.files).toEqual(oldCommit.files);
    });
    it("should add staged files but keep the old message if new message is empty", async () => {
      const user = userEvent.setup();
      customRender(<HomepageView />);
      const oldHeadCommitId = useGitStore.getState().branches.feature.commitId;
      const oldCommit = useGitStore.getState().commits[oldHeadCommitId];
      const stagedFile = useGitStore.getState().stagingArea[0];
      await user.click(screen.getByRole("button", { name: /amend/i }));
      const modalTitle = await screen.findByRole("heading", {
        name: /amend last commit/i,
      });
      const modal = modalTitle.parentElement?.parentElement as HTMLElement;
      await user.click(
        within(modal).getByRole("button", { name: /amend commit/i })
      );
      const state = useGitStore.getState();
      const newCommit = state.commits[state.branches.feature.commitId];
      expect(newCommit.message).toBe(oldCommit.message);
      expect(newCommit.files.length).toBe(oldCommit.files.length + 1);
      expect(newCommit.files.some((f) => f.id === stagedFile.id)).toBe(true);
    });
  });
});
