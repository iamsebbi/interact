import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { describe, expect, test, vi } from "vitest";
import { CATALOG_META } from "@/registry";
import { getComponentGenerators } from "@/registry/generators";
import { ApproveReject } from "@/registry/items/approve-reject/approve-reject";
import { DeleteButton } from "@/registry/items/delete-button/delete-button";
import { DownloadButton } from "@/registry/items/download-button/download-button";
import { ExpandableTabs } from "@/registry/items/expandable-tabs/expandable-tabs";
import { SearchButton } from "@/registry/items/search-button/search-button";
import { SegmentedControl } from "@/registry/items/segmented-control/segmented-control";
import { SelectMenu } from "@/registry/items/select-menu/select-menu";
import { UpdateButton } from "@/registry/items/update-button/update-button";

describe("registry catalog and generators", () => {
  test.each(CATALOG_META)(
    "$slug exposes valid metadata, JSX, and AI prompt generators",
    (entry) => {
      const generators = getComponentGenerators(entry.slug);
      expect(generators).toBeDefined();
      if (!generators) return;

      const jsx = generators.buildJsx(entry.defaultConfig);
      expect(jsx).toContain(`@/components/ui/${entry.slug}`);

      const prompt = generators.buildAiPrompt(entry.defaultConfig);
      expect(prompt).toContain(`${entry.slug}.json`);
      expect(prompt).toContain(jsx);

      expect(entry.props.length).toBeGreaterThan(0);
      expect(entry.howItWorks.length).toBeGreaterThan(0);
    },
  );
});

describe("stateful registry components", () => {
  test("DownloadButton transitions idle -> downloading -> paused -> idle", async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();

    const { container } = render(
      <DownloadButton sizeMB={32} onStatusChange={onStatusChange} />,
    );
    const root = container.querySelector('[data-slot="download-button"]');
    expect(root).toHaveAttribute("data-status", "idle");

    await user.click(screen.getByRole("button", { name: "Download 32 MB" }));
    expect(root).toHaveAttribute("data-status", "downloading");

    await user.click(screen.getByRole("button", { name: "Pause download" }));
    expect(root).toHaveAttribute("data-status", "paused");

    await user.click(screen.getByRole("button", { name: "Cancel download" }));
    expect(root).toHaveAttribute("data-status", "idle");
    expect(onStatusChange.mock.calls.map(([s]) => s)).toEqual([
      "downloading",
      "paused",
      "idle",
    ]);
  });

  test("ApproveReject confirms decision and supports Undo", async () => {
    const user = userEvent.setup();
    const onApprove = vi.fn();
    const onReject = vi.fn();
    const onUndo = vi.fn();

    const { container } = render(
      <ApproveReject
        autoReset={false}
        onApprove={onApprove}
        onReject={onReject}
        onUndo={onUndo}
      />,
    );
    const root = container.querySelector('[data-slot="approve-reject"]');
    expect(root).toHaveAttribute("data-status", "idle");

    await user.click(screen.getByRole("button", { name: "Approve" }));
    expect(root).toHaveAttribute("data-status", "approved");
    expect(onApprove).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Undo approval" }));
    expect(root).toHaveAttribute("data-status", "idle");
    expect(onUndo).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Reject" }));
    expect(root).toHaveAttribute("data-status", "rejected");
    expect(onReject).toHaveBeenCalledTimes(1);
  });

  test("DeleteButton opens confirmation split and handles Cancel and Confirm", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    const { container } = render(
      <DeleteButton
        showDeletedState
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    const root = container.querySelector('[data-slot="delete-button"]');
    expect(root).toHaveAttribute("data-status", "idle");

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(root).toHaveAttribute("data-status", "confirming");

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(root).toHaveAttribute("data-status", "idle");
    expect(onCancel).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(root).toHaveAttribute("data-status", "deleted");
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test("SearchButton expands, submits query on Enter, and closes on Escape", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchButton onSearch={onSearch} />);

    const trigger = screen.getByRole("button", { name: "Open search" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    const input = screen.getByRole("searchbox", { name: "Search" });
    await user.type(input, "buttons{Enter}");
    expect(onSearch).toHaveBeenCalledWith("buttons");

    await user.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Open search" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  test("UpdateButton starts updating and supports Cancel", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    const { container } = render(<UpdateButton onCancel={onCancel} />);
    const root = container.querySelector('[data-slot="update-button"]');
    expect(root).toHaveAttribute("data-status", "idle");

    await user.click(screen.getByRole("button", { name: "Update" }));
    expect(root).toHaveAttribute("data-status", "updating");

    await user.click(screen.getByRole("button", { name: "Cancel update" }));
    expect(root).toHaveAttribute("data-status", "idle");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test("ExpandableTabs toggles tabs and closes on Escape and outside click", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <div>
        <button type="button">Outside target</button>
        <ExpandableTabs
          onValueChange={onValueChange}
          items={[
            {
              id: "launch",
              label: "Launch",
              icon: <span aria-hidden="true">R</span>,
              content: <div>Launch panel content</div>,
            },
            {
              id: "inbox",
              label: "Inbox",
              icon: <span aria-hidden="true">I</span>,
              content: <div>Inbox panel content</div>,
            },
          ]}
        />
      </div>,
    );

    const launchTab = screen.getByRole("tab", { name: "Launch" });
    const inboxTab = screen.getByRole("tab", { name: "Inbox" });
    expect(launchTab).toHaveAttribute("aria-selected", "false");

    await user.click(launchTab);
    expect(launchTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getAllByText("Launch panel content").length).toBeGreaterThan(
      0,
    );

    await user.keyboard("{Escape}");
    expect(launchTab).toHaveAttribute("aria-selected", "false");
    expect(onValueChange).toHaveBeenLastCalledWith(null, "escape");

    await user.click(inboxTab);
    expect(inboxTab).toHaveAttribute("aria-selected", "true");

    await user.pointer({
      keys: "[MouseLeft>]",
      target: screen.getByRole("button", { name: "Outside target" }),
    });
    expect(inboxTab).toHaveAttribute("aria-selected", "false");
    expect(onValueChange).toHaveBeenLastCalledWith(null, "outside");
  });

  test("SegmentedControl supports pointer, keyboard navigation, disabled skipping, and createAgent()", async () => {
    const user = userEvent.setup();
    const agent = createAgent();
    const onValueChange = vi.fn();

    render(
      <SegmentedControl
        items={[
          { value: "Day", label: "Day" },
          { value: "Week", label: "Week" },
          { value: "Month", label: "Month", disabled: true },
          { value: "Year", label: "Year" },
        ]}
        defaultValue="Day"
        onValueChange={onValueChange}
        aria-label="Time range"
      />,
    );

    const day = screen.getByRole("radio", { name: "Day" });
    const week = screen.getByRole("radio", { name: "Week" });
    const year = screen.getByRole("radio", { name: "Year" });
    expect(day).toHaveAttribute("aria-checked", "true");

    // Assign realistic unscaled geometry so the two-edge indicator animation runs in jsdom.
    const boxes = [
      [day, 6, 60],
      [week, 68, 72],
      [year, 224, 68],
    ] as const;
    for (const [el, left, width] of boxes) {
      Object.defineProperty(el, "offsetLeft", {
        configurable: true,
        value: left,
      });
      Object.defineProperty(el, "offsetWidth", {
        configurable: true,
        value: width,
      });
    }

    await user.click(week);
    expect(week).toHaveAttribute("aria-checked", "true");
    expect(onValueChange).toHaveBeenLastCalledWith(
      "Week",
      expect.objectContaining({ reason: "item-press" }),
    );

    const indicator = document.querySelector<HTMLElement>(
      '[data-slot="segmented-control-indicator"]',
    );
    expect(indicator).not.toBeNull();
    // Moving right must lag the left edge instead of teleporting it to Week's left (68px).
    expect(indicator?.style.transform).not.toContain("68px");

    week.focus();
    await user.keyboard("{ArrowRight}");
    expect(year).toHaveAttribute("aria-checked", "true");
    expect(onValueChange).toHaveBeenLastCalledWith(
      "Year",
      expect.objectContaining({ reason: "list-navigation" }),
    );

    const entries = agent
      .snapshot()
      .filter((entry) => !entry.offPage && entry.component !== "more");
    expect(entries.map((entry) => entry.label)).toContain("Time range");

    const result = await agent.act({
      steps: [{ ref: "Time range", action: "setValue", args: ["Day"] }],
    });
    expect(result.ok, result.error?.message).toBe(true);
    expect(day).toHaveAttribute("aria-checked", "true");
    expect(onValueChange).toHaveBeenLastCalledWith(
      "Day",
      expect.objectContaining({ source: "agent" }),
    );
  });

  test("SelectMenu morphs open, picks via click and keyboard, skips disabled items, and closes on Escape and outside click", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <div>
        <button type="button">Outside select target</button>
        <SelectMenu
          label="Sort"
          items={[
            { value: "Newest", label: "Newest" },
            { value: "Disabled", label: "Disabled", disabled: true },
            { value: "Top rated", label: "Top rated" },
          ]}
          defaultValue="Newest"
          onValueChange={onValueChange}
        />
      </div>,
    );

    const combobox = screen.getByRole("combobox", { name: "Sort: Newest" });
    expect(combobox).toHaveAttribute("aria-expanded", "false");

    await user.click(combobox);
    expect(combobox).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("option", { name: "Top rated" }));
    await waitFor(() => {
      expect(onValueChange).toHaveBeenLastCalledWith("Top rated", 2);
      expect(combobox).toHaveAttribute("aria-expanded", "false");
    });

    combobox.focus();
    await user.keyboard("{ArrowDown}");
    expect(combobox).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => {
      expect(onValueChange).toHaveBeenLastCalledWith("Newest", 0);
      expect(combobox).toHaveAttribute("aria-expanded", "false");
    });

    await user.click(combobox);
    expect(combobox).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    expect(combobox).toHaveAttribute("aria-expanded", "false");

    await user.click(combobox);
    expect(combobox).toHaveAttribute("aria-expanded", "true");
    await user.pointer({
      keys: "[MouseLeft>]",
      target: screen.getByRole("button", { name: "Outside select target" }),
    });
    expect(combobox).toHaveAttribute("aria-expanded", "false");
  });
});
