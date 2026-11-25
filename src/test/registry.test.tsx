import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { describe, expect, test, vi } from "vitest";
import { CATALOG_META } from "@/registry";
import { getComponentGenerators } from "@/registry/generators";
import { ApproveReject } from "@/registry/items/approve-reject/approve-reject";
import { CodeInput } from "@/registry/items/code-input/code-input";
import { DeleteButton } from "@/registry/items/delete-button/delete-button";
import { DownloadButton } from "@/registry/items/download-button/download-button";
import { ExpandableTabs } from "@/registry/items/expandable-tabs/expandable-tabs";
import { MeetingScheduler } from "@/registry/items/meeting-scheduler/meeting-scheduler";
import { SearchButton } from "@/registry/items/search-button/search-button";
import { SegmentedControl } from "@/registry/items/segmented-control/segmented-control";
import { SelectMenu } from "@/registry/items/select-menu/select-menu";
import { StatusPill } from "@/registry/items/status-pill/status-pill";
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

  test("MeetingScheduler walks through day/time -> people/duration -> confirmed booking and supports Escape cancel", async () => {
    const user = userEvent.setup();
    const onSchedule = vi.fn().mockResolvedValue(true);
    const onCancel = vi.fn();

    const { container } = render(
      <MeetingScheduler
        onSchedule={onSchedule}
        onCancel={onCancel}
        resetAfterMs={0}
      />,
    );

    const root = container.querySelector('[data-slot="meeting-scheduler"]');
    expect(root).toHaveAttribute("data-step", "rest");

    await user.click(screen.getByRole("button", { name: "Schedule a call" }));
    expect(root).toHaveAttribute("data-step", "time");

    // Pick an available (non-busy) time slot; day 0, index 0 is 09:00 (not busy).
    await user.click(screen.getByRole("button", { name: "09:00" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(root).toHaveAttribute("data-step", "people");

    // Toggle Lena and switch duration to 45 min, then schedule.
    await user.click(screen.getByRole("button", { name: /Lena/i }));
    await user.click(screen.getByRole("button", { name: "45 min" }));
    await user.click(screen.getByRole("button", { name: /Schedule ·/i }));

    await waitFor(() => {
      expect(onSchedule).toHaveBeenCalledWith(
        expect.objectContaining({
          time: "09:00",
          duration: "45 min",
          attendees: expect.arrayContaining([
            "Ava Chen",
            "Marco Rossi",
            "Lena Park",
          ]),
        }),
      );
      expect(root).toHaveAttribute("data-step", "done");
    });

    // Separate Escape cancellation check on a fresh mount.
    const { container: second } = render(
      <MeetingScheduler onCancel={onCancel} />,
    );
    const secondRoot = second.querySelector('[data-slot="meeting-scheduler"]');
    await user.click(screen.getByRole("button", { name: "Schedule a call" }));
    expect(secondRoot).toHaveAttribute("data-step", "time");
    await user.keyboard("{Escape}");
    expect(secondRoot).toHaveAttribute("data-step", "rest");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test("StatusPill transitions idle -> syncing -> done and recovers from failure via Retry", async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();

    const { container, unmount } = render(
      <StatusPill
        demoMode="succeed"
        demoFiles={2}
        speed={2}
        resetAfterMs={0}
        onStatusChange={onStatusChange}
      />,
    );
    const root = container.querySelector('[data-slot="status-pill"]');
    expect(root).toHaveAttribute("data-status", "idle");

    await user.click(screen.getByRole("button", { name: "Up to date" }));
    expect(root).toHaveAttribute("data-status", "syncing");

    await waitFor(
      () => {
        expect(root).toHaveAttribute("data-status", "done");
      },
      { timeout: 3000 },
    );
    expect(onStatusChange).toHaveBeenCalledWith("done", { left: 0, total: 2 });
    unmount();

    const onRetry = vi.fn();
    const { container: failContainer } = render(
      <StatusPill
        demoMode="fail"
        demoFiles={2}
        speed={2}
        resetAfterMs={0}
        onRetry={onRetry}
      />,
    );
    const failRoot = failContainer.querySelector('[data-slot="status-pill"]');
    await user.click(screen.getByRole("button", { name: "Up to date" }));

    await waitFor(
      () => {
        expect(failRoot).toHaveAttribute("data-status", "failed");
      },
      { timeout: 3000 },
    );

    const retryBtn = await screen.findByRole(
      "button",
      { name: "Retry" },
      { timeout: 2000 },
    );
    await user.click(retryBtn);
    expect(onRetry).toHaveBeenCalledWith(1);
    expect(failRoot).toHaveAttribute("data-status", "syncing");

    await waitFor(
      () => {
        expect(failRoot).toHaveAttribute("data-status", "done");
      },
      { timeout: 3000 },
    );
  });

  test("CodeInput splits into cells, verifies valid code, and rejects wrong code with error state", async () => {
    const user = userEvent.setup();
    const onVerified = vi.fn();
    const onRejected = vi.fn();

    const { container, unmount } = render(
      <CodeInput
        length={4}
        testCode="1234"
        speed={2}
        resetAfterMs={0}
        onVerified={onVerified}
        onRejected={onRejected}
      />,
    );
    const root = container.querySelector('[data-slot="code-input"]');
    expect(root).toHaveAttribute("data-status", "rest");

    const input = screen.getByRole("textbox", { name: "4-digit code" });
    await user.click(input);
    expect(root).toHaveAttribute("data-status", "entry");

    // Wrong code triggers verify -> rejected -> returns to entry with error.
    await user.type(input, "9999");
    await waitFor(
      () => {
        expect(onRejected).toHaveBeenCalledWith("9999");
        expect(root).toHaveAttribute("data-status", "entry");
      },
      { timeout: 3000 },
    );

    // Wait for right-to-left clear, then enter valid code.
    await waitFor(
      () => {
        expect(root).toHaveAttribute("data-error", "false");
      },
      { timeout: 2000 },
    );

    await user.type(input, "1234");
    await waitFor(
      () => {
        expect(onVerified).toHaveBeenCalledWith("1234");
        expect(root).toHaveAttribute("data-status", "ok");
      },
      { timeout: 3000 },
    );
    unmount();
  });

  test("migrated ui-sdk components are discoverable and operable via createAgent()", async () => {
    const agent = createAgent();
    const onSelectChange = vi.fn();
    const onStatusChange = vi.fn();

    const { unmount } = render(
      <div>
        <SelectMenu
          label="Sort"
          items={["Newest", "Top rated"]}
          defaultValue="Newest"
          onValueChange={onSelectChange}
        />
        <StatusPill
          demoMode="succeed"
          demoFiles={1}
          speed={2}
          resetAfterMs={0}
          onStatusChange={onStatusChange}
        />
      </div>,
    );

    const selectResult = await agent.act({
      steps: [{ ref: "Sort", action: "setValue", args: ["Top rated"] }],
    });
    expect(selectResult.ok, selectResult.error?.message).toBe(true);
    expect(onSelectChange).toHaveBeenCalledWith("Top rated", 1);

    const syncResult = await agent.act({
      steps: [{ ref: "Up to date", action: "press" }],
    });
    expect(syncResult.ok, syncResult.error?.message).toBe(true);
    expect(onStatusChange).toHaveBeenCalledWith("syncing", {
      left: 1,
      total: 1,
    });
    unmount();

    const { container: schedContainer, unmount: unmountSched } = render(
      <div>
        <MeetingScheduler resetAfterMs={0} />
        <CodeInput length={4} testCode="1234" speed={2} resetAfterMs={0} />
      </div>,
    );
    const openSched = await agent.act({
      steps: [{ ref: "Schedule a call", action: "press" }],
    });
    expect(openSched.ok, openSched.error?.message).toBe(true);
    expect(
      schedContainer.querySelector('[data-slot="meeting-scheduler"]'),
    ).toHaveAttribute("data-step", "time");

    const codeAct = await agent.act({
      steps: [{ ref: "4-digit code", action: "setValue", args: ["1234"] }],
    });
    expect(codeAct.ok, codeAct.error?.message).toBe(true);
    expect(
      schedContainer.querySelector('[data-slot="code-input"]'),
    ).toHaveAttribute("data-status", "entry");
    unmountSched();
  });
});
