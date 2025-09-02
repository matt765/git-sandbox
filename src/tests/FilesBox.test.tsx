// src/tests/FilesBox.test.tsx
import { render, screen, act, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { HomepageView } from "@/components/views/homepage/HomepageView";
import { FilesBox } from "@/components/views/homepage/parts/filesBox/FilesBox";
import { useGitStore } from "@/store/gitStore";
import { Providers } from "@/services/Providers";

const customRender = (ui: ReactNode) => {
  return render(<Providers>{ui}</Providers>);
};

describe("FilesBox Component Tests", () => {
  beforeEach(() => {
    act(() => {
      useGitStore.getState().resetApp();
    });
  });

  const getSections = () => {
    const stagedChangesSection = screen.queryByText(/Staged Changes/i)?.closest('div[class*="container"]') as HTMLElement | null;
    const changesSection = screen.queryByText(/^Changes$/i)?.closest('div[class*="container"]') as HTMLElement | null;
    return { stagedChangesSection, changesSection };
  };

  it("should correctly display initial files in their respective sections", () => {
    customRender(<FilesBox />);
    const { stagedChangesSection, changesSection } = getSections();
    expect(within(stagedChangesSection!).getByText("api.ts")).toBeInTheDocument();
    expect(within(changesSection!).getByText("utils.ts")).toBeInTheDocument();
  });

  it("should not render a section if it has no files", () => {
    act(() => { useGitStore.getState().stageAllFiles(); });
    customRender(<FilesBox />);
    expect(screen.getByText(/Staged Changes/i)).toBeInTheDocument();
    expect(screen.queryByText(/^Changes$/i)).not.toBeInTheDocument();
  });

  describe("UI Interactions", () => {
    it("collapses and expands the changes section on header click", async () => {
      const user = userEvent.setup();
      customRender(<FilesBox />);
      const { changesSection } = getSections();
      expect(within(changesSection!).getByText("utils.ts")).toBeVisible();
      await user.click(within(changesSection!).getByRole('button', { name: /Changes/ }));
      expect(within(changesSection!).queryByText("utils.ts")).not.toBeInTheDocument();
      await user.click(within(changesSection!).getByRole('button', { name: /Changes/ }));
      expect(within(changesSection!).getByText("utils.ts")).toBeVisible();
    });
  });

  describe("File Staging and Unstaging", () => {
    it("should move a file from Changes to Staged Changes when '+' is clicked", async () => {
      const user = userEvent.setup();
      customRender(<FilesBox />);
      const { changesSection: initialChangesSection } = getSections();
      const fileItem = within(initialChangesSection!).getByText("utils.ts").closest('div[class*="container"]') as HTMLElement;
      await user.click(within(fileItem!).getByRole("button", { name: "+" }));
      const { stagedChangesSection } = getSections();
      expect(within(stagedChangesSection!).getByText("utils.ts")).toBeInTheDocument();
      expect(screen.queryByText(/^Changes$/i)).not.toBeInTheDocument();
    });

    it("should move a file from Staged Changes to Changes when '-' is clicked", async () => {
      const user = userEvent.setup();
      customRender(<FilesBox />);
      const { stagedChangesSection: initialStagedSection } = getSections();
      const fileItem = within(initialStagedSection!).getByText("api.ts").closest('div[class*="container"]') as HTMLElement;
      await user.click(within(fileItem!).getByRole("button", { name: "-" }));
      const { changesSection } = getSections();
      expect(within(changesSection!).getByText("api.ts")).toBeInTheDocument();
      expect(screen.queryByText(/Staged Changes/i)).not.toBeInTheDocument();
    });
  });

  describe("Stage All and Unstage All Actions", () => {
    it("should stage all files when header '+' button is clicked", async () => {
      const user = userEvent.setup();
      customRender(<FilesBox />);
      await user.click(screen.getByTitle("Stage all changes"));
      const { stagedChangesSection } = getSections();
      expect(within(stagedChangesSection!).getByText("utils.ts")).toBeInTheDocument();
      expect(within(stagedChangesSection!).getByText("api.ts")).toBeInTheDocument();
      expect(screen.queryByText(/^Changes$/i)).not.toBeInTheDocument();
    });

    it("should unstage all files when header '-' button is clicked", async () => {
      const user = userEvent.setup();
      act(() => { useGitStore.getState().stageAllFiles(); });
      customRender(<FilesBox />);
      await user.click(screen.getByTitle("Unstage all changes"));
      const { changesSection } = getSections();
      expect(within(changesSection!).getByText("utils.ts")).toBeInTheDocument();
      expect(within(changesSection!).getByText("api.ts")).toBeInTheDocument();
      expect(screen.queryByText(/Staged Changes/i)).not.toBeInTheDocument();
    });
  });

  describe("Commit and Footer Actions", () => {
    it("should have the Commit button disabled when staging area is empty", () => {
      act(() => { useGitStore.getState().unstageAllFiles(); });
      customRender(<FilesBox />);
      expect(screen.getByRole("button", { name: "Commit" })).toBeDisabled();
    });

    it("should show error on empty commit and remove it on click outside", async () => {
        const user = userEvent.setup();
        customRender(<HomepageView />); 
        const commitInput = screen.getByPlaceholderText(/message/i);
        const commitButton = screen.getByRole("button", { name: "Commit" });
        
        await user.click(commitButton);
        expect(commitInput).toHaveClass("error");

        // POPRAWKA: Klikamy na `document.body`, co jest najpewniejszym sposobem
        // na symulację kliknięcia "na zewnątrz" wszystkiego.
        await user.click(document.body);
        
        expect(commitInput).not.toHaveClass("error");
    });
    
    it("should NOT commit when only Enter is pressed", async () => {
        const user = userEvent.setup();
        customRender(<FilesBox />);
        const initialLogCount = useGitStore.getState().logs.length;
        
        const messageInput = screen.getByPlaceholderText(/message/i);
        await user.type(messageInput, "A valid message");
        await user.keyboard('[Enter]');

        expect(useGitStore.getState().logs.length).toBe(initialLogCount);
        expect(messageInput).toHaveValue("A valid message");
    });

    it("should clear the staging area after a successful commit", async () => {
      const user = userEvent.setup();
      customRender(<FilesBox />);
      await user.type(screen.getByPlaceholderText(/message/i), "Test commit");
      await user.click(screen.getByRole("button", { name: "Commit" }));
      expect(screen.queryByText(/Staged Changes/i)).not.toBeInTheDocument();
      expect(useGitStore.getState().stagingArea).toHaveLength(0);
    });

    it("should create a commit with Ctrl+Enter keyboard shortcut", async () => {
      const user = userEvent.setup();
      customRender(<FilesBox />);
      const messageInput = screen.getByPlaceholderText(/message/i);
      await user.type(messageInput, "Commit via shortcut");
      await user.keyboard('{Control>}[Enter]{/Control}');
      expect(screen.queryByText(/Staged Changes/i)).not.toBeInTheDocument();
      expect(useGitStore.getState().logs.some(log => log.includes("Commit via shortcut"))).toBe(true);
    });

    it("should add a new file to Changes when 'Add new file' button is clicked", async () => {
      const user = userEvent.setup();
      customRender(<FilesBox />);
      await user.click(screen.getByRole("button", { name: "Add new file" }));
      const { changesSection } = getSections();
      expect(within(changesSection!).getByText(/Component-\d+\.tsx/)).toBeInTheDocument();
    });

    it("should discard all changes from both sections", async () => {
      const user = userEvent.setup();
      customRender(<FilesBox />);
      await user.click(screen.getByRole("button", { name: "Discard all changes" }));
      expect(screen.queryByText(/Staged Changes/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/^Changes$/i)).not.toBeInTheDocument();
    });
  });

  describe("Reactivity to External Git Commands", () => {
    it("should clear both sections after a 'reset --hard' command", async () => {
      const user = userEvent.setup();
      customRender(<HomepageView />);
      expect(screen.getByText(/Staged Changes/i)).toBeInTheDocument();
      expect(screen.getByText(/^Changes$/i)).toBeInTheDocument();
      const commitsOptionsSection = screen.getByText(/Commits options/i).parentElement as HTMLElement;
      await user.click(within(commitsOptionsSection).getByRole("button", { name: /^Reset$/i }));
      const modalTitle = await screen.findByRole("heading", { name: /reset branch/i });
      const modal = modalTitle.parentElement?.parentElement as HTMLElement;
      const select = within(modal).getByRole('combobox');
      await user.selectOptions(select, "c4553b");
      await user.click(within(modal).getByLabelText(/hard/i));
      await user.click(within(modal).getByRole("button", { name: "Reset" }));
      expect(screen.queryByText(/Staged Changes/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/^Changes$/i)).not.toBeInTheDocument();
    });

    it("should update sections correctly after a 'reset --mixed' command", async () => {
      const user = userEvent.setup();
      customRender(<HomepageView />);
      const commitsOptionsSection = screen.getByText(/Commits options/i).parentElement as HTMLElement;
      await user.click(within(commitsOptionsSection).getByRole("button", { name: /^Reset$/i }));
      const modalTitle = await screen.findByRole("heading", { name: /reset branch/i });
      const modal = modalTitle.parentElement?.parentElement as HTMLElement;
      const select = within(modal).getByRole('combobox');
      await user.selectOptions(select, "c4553b");
      await user.click(within(modal).getByLabelText(/mixed/i));
      await user.click(within(modal).getByRole("button", { name: "Reset" }));
      const { changesSection } = getSections();
      expect(screen.queryByText(/Staged Changes/i)).not.toBeInTheDocument();
      expect(within(changesSection!).getByText("utils.ts")).toBeInTheDocument();
      expect(within(changesSection!).getByText("api.ts")).toBeInTheDocument();
      expect(within(changesSection!).getByText("Login.css")).toBeInTheDocument();
    });
  });
});