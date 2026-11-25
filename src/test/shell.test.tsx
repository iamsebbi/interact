import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { OverlayHost } from "@ui-sdk/react/overlays";
import { toast } from "@ui-sdk/react/toast";
import type { ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { HowToUseContent } from "@/app/how-to-use/HowToUseContent";
import { PricingContent } from "@/app/pricing/PricingContent";
import {
  SelectField,
  Slider,
  Switch,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  TextareaField,
  TextField,
} from "@/components/controls";
import { CodeTabsClient } from "@/components/showcase/CodeTabsClient";
import {
  ComponentDetailView,
  ShowcaseChoiceButton,
  ShowcaseSection,
} from "@/components/showcase/ComponentDetailView";
import { ComponentsGrid } from "@/components/showcase/ComponentsGrid";
import { PropsTable } from "@/components/showcase/PropsTable";
import { StudioShell } from "@/components/studio/StudioShell";
import { CATALOG_META, getComponentMetaBySlug } from "@/registry";

const mockPush = vi.fn();

vi.mock("@number-flow/react", () => ({
  default: ({
    value,
    prefix = "",
    className,
  }: {
    value: number;
    prefix?: string;
    className?: string;
  }) => (
    <span className={className}>
      {prefix}
      {value}
    </span>
  ),
}));

vi.mock("voice-glow", () => ({
  VoiceBeam: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  useMicrophone: () => ({
    state: "idle",
    stream: null,
    error: null,
    start: vi.fn(),
    stop: vi.fn(),
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/studio",
}));

describe("internal ui-sdk controls", () => {
  test("Switch toggles with Space key", async () => {
    const user = userEvent.setup();
    render(<Switch label="Interactive" defaultChecked={false} />);

    const toggle = screen.getByRole("switch", { name: "Interactive" });
    expect(toggle).toHaveAttribute("aria-checked", "false");

    toggle.focus();
    await user.keyboard(" ");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  test("Tabs switches panels with keyboard arrows", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="preview">
        <TabsList aria-label="View mode">
          <TabsTab value="preview">Preview</TabsTab>
          <TabsTab value="code">Code</TabsTab>
        </TabsList>
        <TabsPanel value="preview">Preview panel</TabsPanel>
        <TabsPanel value="code">Code panel</TabsPanel>
      </Tabs>,
    );

    const previewTab = screen.getByRole("tab", { name: "Preview" });
    previewTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Code" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Code panel")).toBeVisible();
  });

  test("sidepanel config controls work and are agent-ready", async () => {
    const agent = createAgent();
    const onLabelChange = vi.fn();
    const onTranscriptChange = vi.fn();
    const onShapeChange = vi.fn();
    const onPresetSelect = vi.fn();

    render(
      <div>
        <SelectField
          label="Shape"
          value="squircle"
          onValueChange={onShapeChange}
          showDividerAfterFirst
          options={[
            { value: "squircle", label: "Squircle" },
            { value: "circle", label: "Circle" },
          ]}
        />
        <Slider
          label="Duration"
          defaultValue={2.4}
          min={1}
          max={6}
          step={0.2}
        />
        <TextField
          label="Button label"
          defaultValue="Update"
          onValueChange={onLabelChange}
        />
        <TextareaField
          label="Transcript"
          defaultValue="Hello"
          onValueChange={onTranscriptChange}
        />
        <ShowcaseSection label="Presets (2)" valueLabel="Aurora">
          <ShowcaseChoiceButton selected onClick={onPresetSelect}>
            Aurora
          </ShowcaseChoiceButton>
        </ShowcaseSection>
      </div>,
    );

    const components = agent
      .snapshot()
      .filter((entry) => !entry.offPage && entry.component !== "more");
    for (const entry of components) {
      expect(
        entry.label,
        `${entry.component} ${entry.ref} has no accessible name`,
      ).toBeTruthy();
    }

    const labels = components.map((entry) => entry.label);
    expect(labels).toContain("Shape");
    expect(labels).toContain("Duration");
    expect(labels).toContain("Button label");
    expect(labels).toContain("Transcript");
    expect(labels).toContain("Aurora");

    const result = await agent.act({
      steps: [
        { ref: "Shape", action: "setValue", args: ["Circle"] },
        { ref: "Button label", action: "setValue", args: ["Deploying"] },
        { ref: "Transcript", action: "setValue", args: ["Ready to ship"] },
        { ref: "Aurora", action: "press" },
      ],
    });
    expect(result.ok, result.error?.message).toBe(true);
    expect(onShapeChange).toHaveBeenCalledWith("circle");
    expect(onLabelChange).toHaveBeenCalledWith("Deploying", expect.anything());
    expect(onTranscriptChange).toHaveBeenCalledWith(
      "Ready to ship",
      expect.anything(),
    );
    expect(onPresetSelect).toHaveBeenCalled();
  });
});

describe("app shell pages", () => {
  let hostContainer: HTMLDivElement | null = null;
  let hostRoot: Root | null = null;

  beforeAll(() => {
    hostContainer = document.createElement("div");
    document.body.appendChild(hostContainer);
    hostRoot = createRoot(hostContainer);
    hostRoot.render(<OverlayHost />);
  });

  afterAll(() => {
    // Keep hostRoot mounted until jsdom teardown so @ui-sdk's 1s overlay-host check timer never sees hosts === 0 after fast runs.
    hostContainer?.remove();
    hostRoot = null;
    hostContainer = null;
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    toast.dismiss();
  });

  test("Showcase ComponentsGrid filters categories and toggles saved bookmark", async () => {
    const user = userEvent.setup();
    render(
      <>
        <OverlayHost />
        <ComponentsGrid />
      </>,
    );

    expect(
      screen.getByRole("group", {
        name: "Filter components by interaction",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getAllByText("Search Button").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Inputs" }));
    expect(screen.getByRole("button", { name: "Inputs" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getAllByText("Search Button").length).toBeGreaterThan(0);
    expect(screen.queryByText("Download Button")).not.toBeInTheDocument();

    const saveBtn = screen.getByRole("button", { name: "Save Search Button" });
    await user.click(saveBtn);
    expect(
      screen.getByRole("button", { name: "Unsave Search Button" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("Showcase ComponentsGrid is agent-ready with every control named", () => {
    const agent = createAgent();
    render(<ComponentsGrid />);

    const components = agent
      .snapshot()
      .filter((entry) => !entry.offPage && entry.component !== "more");

    for (const entry of components) {
      expect(
        entry.label,
        `${entry.component} ${entry.ref} has no accessible name`,
      ).toBeTruthy();
    }

    const labels = components.map((entry) => entry.label);
    expect(labels).toContain("All");
    expect(labels).toContain("Inputs");
    expect(labels).toContain("Save Search Button");
    expect(labels).toContain("Edit Search Button");
  });

  test("Showcase ComponentsGrid opens component preview overlay with URL sync and closes cleanly", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/");

    render(
      <>
        <OverlayHost />
        <ComponentsGrid />
      </>,
    );

    const openLink = screen.getByRole("link", { name: "Open Search Button" });
    await user.click(openLink);

    expect(
      screen.getByRole("dialog", { name: "Search Button preview" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/components/search-button");

    const closeBtn = screen.getByRole("button", {
      name: "Close component details",
    });
    await user.click(closeBtn);

    await vi.waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Search Button preview" }),
      ).not.toBeInTheDocument();
    });
    expect(window.location.pathname).toBe("/");
  });

  test("Showcase ComponentsGrid closes overlay when clicking empty space on desktop but stays open on surface click", async () => {
    const user = userEvent.setup();
    const originalMatchMedia = window.matchMedia;
    const matchMediaSpy = vi
      .spyOn(window, "matchMedia")
      .mockImplementation((query: string) => ({
        ...originalMatchMedia(query),
        matches: query === "(min-width: 1024px)",
        media: query,
      }));

    try {
      window.history.replaceState(null, "", "/");

      render(
        <>
          <OverlayHost />
          <ComponentsGrid />
        </>,
      );

      await user.click(
        screen.getByRole("link", { name: "Open Search Button" }),
      );
      const dialog = screen.getByRole("dialog", {
        name: "Search Button preview",
      });
      expect(dialog).toBeInTheDocument();

      await user.click(
        screen.getByRole("heading", { name: "Search Button", level: 1 }),
      );
      expect(
        screen.getByRole("dialog", { name: "Search Button preview" }),
      ).toBeInTheDocument();

      await user.click(dialog);

      await vi.waitFor(() => {
        expect(
          screen.queryByRole("dialog", { name: "Search Button preview" }),
        ).not.toBeInTheDocument();
      });
      expect(window.location.pathname).toBe("/");
    } finally {
      matchMediaSpy.mockRestore();
    }
  });

  test("HowToUseContent renders workflow cards, component table, and agent-ready FAQ", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    const agent = createAgent();
    render(<HowToUseContent />);

    expect(
      screen.getByRole("heading", { name: "How to use" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Copy the prompt" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Paste it in your agent" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Make it yours" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: `All ${CATALOG_META.length} components`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Technical FAQ" }),
    ).toBeInTheDocument();

    const copyButton = screen.getByRole("button", {
      name: "Copy CLI command for Download",
    });
    await user.click(copyButton);
    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining("download-button.json"),
    );
    expect(screen.getByText("copied cli")).toBeInTheDocument();

    const components = agent
      .snapshot()
      .filter((entry) => !entry.offPage && entry.component !== "more");
    for (const entry of components) {
      expect(
        entry.label,
        `${entry.component} ${entry.ref} has no accessible name`,
      ).toBeTruthy();
    }
    expect(components.map((entry) => entry.label)).toContain("Technical FAQ");
  });

  test("ComponentDetailView renders 3-column detail layout, switches Preview/Code, and is agent-ready", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    const meta = getComponentMetaBySlug("search-button");
    expect(meta).toBeDefined();
    if (!meta) return;

    const agent = createAgent();
    render(
      <>
        <OverlayHost />
        <ComponentDetailView
          meta={meta}
          componentList={CATALOG_META.map((item) => ({
            slug: item.slug,
            title: item.title,
          }))}
          codeSlot={
            <CodeTabsClient
              data={{
                install: {
                  raw: "pnpm dlx shadcn@latest add https://interact.dev/r/search-button.json",
                  html: "<pre><code>pnpm dlx shadcn@latest add https://interact.dev/r/search-button.json</code></pre>",
                },
                usage: {
                  raw: "<SearchButton />",
                  html: "<pre><code>&lt;SearchButton /&gt;</code></pre>",
                },
                sourceFiles: [],
                props: {
                  count: meta.props.length,
                  raw: "export interface SearchButtonProps {}",
                  html: "<pre><code>export interface SearchButtonProps {}</code></pre>",
                },
              }}
            />
          }
          propsSlot={<PropsTable props={meta.props} />}
        />
      </>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Search Button" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Search Button" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Component navigation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save Search Button" }),
    ).toHaveAttribute("aria-pressed", "false");

    await user.click(
      screen.getByRole("button", { name: "Save Search Button" }),
    );
    expect(
      screen.getByRole("button", { name: "Unsave Search Button" }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("tab", { name: "Code" }));
    const copyPromptBtn = screen.getByRole("button", { name: "Copy prompt" });
    await user.click(copyPromptBtn);
    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining("Search Button"),
    );

    await user.click(screen.getByRole("button", { name: "Usage" }));
    await user.click(screen.getByRole("button", { name: "Copy usage JSX" }));
    expect(writeText).toHaveBeenCalledWith("<SearchButton />");

    await screen.findByRole("slider", { name: "Width" });

    const components = agent
      .snapshot()
      .filter((entry) => !entry.offPage && entry.component !== "more");
    for (const entry of components) {
      expect(
        entry.label,
        `${entry.component} ${entry.ref} has no accessible name`,
      ).toBeTruthy();
    }
    const labels = components.map((entry) => entry.label);
    expect(labels).toContain("Stage view");
    expect(labels).toContain("Size");
    expect(labels).toContain("Theme");
    expect(labels).toContain("Placeholder");
    expect(labels).toContain("Width");
    expect(labels).toContain("Pull");
    expect(labels).toContain("Reset");
    expect(labels).toContain("Open in Studio");
  });

  test("PricingContent renders all legacy sections and handles billing cycles", async () => {
    const user = userEvent.setup();
    render(<PricingContent />);

    expect(
      screen.getByRole("heading", { name: "unlock PRO" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Vercel")).toBeInTheDocument();
    expect(screen.getByText("Linear")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "What you will get" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Licensing FAQ" }),
    ).toBeInTheDocument();

    expect(screen.getByText("$108")).toBeInTheDocument();
    expect(
      screen.getByText("Save 25% billed yearly. Cancel anytime."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Monthly" }));
    expect(screen.getByText("$12")).toBeInTheDocument();
    expect(
      screen.getByText("Full access for solo builders. Cancel anytime."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Lifetime" }));
    expect(screen.getByText("$149")).toBeInTheDocument();
    expect(
      screen.getByText("Pay once, own every update forever."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Unavailable on Lifetime" }),
    ).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Get Pro" }));
    expect(
      screen.getByText(/Success! Pro plan activated\. Redirecting to Studio/),
    ).toBeInTheDocument();
  });

  test("PricingContent is agent-ready with every interactive control named", () => {
    const agent = createAgent();
    render(<PricingContent />);

    const components = agent
      .snapshot()
      .filter((entry) => !entry.offPage && entry.component !== "more");

    for (const entry of components) {
      expect(
        entry.label,
        `${entry.component} ${entry.ref} has no accessible name`,
      ).toBeTruthy();
    }

    const labels = components.map((entry) => entry.label);
    expect(labels).toContain("Billing cycle");
    expect(labels).toContain("Get Pro");
    expect(labels).toContain("Browse Free");
  });

  test("StudioShell is agent-ready and every control is named", async () => {
    const agent = createAgent();
    render(
      <>
        <OverlayHost />
        <StudioShell />
      </>,
    );

    await screen.findByRole("slider", { name: "File Size" });

    const components = agent
      .snapshot()
      .filter((entry) => !entry.offPage && entry.component !== "more");

    for (const entry of components) {
      expect(
        entry.label,
        `${entry.component} ${entry.ref} has no accessible name`,
      ).toBeTruthy();
    }

    const labels = components.map((entry) => entry.label);
    for (const expected of [
      "Download 32 MB",
      "Size",
      "Readout",
      "File Size",
      "Duration",
      "Canvas background",
      "Export",
    ]) {
      expect(labels, `${expected} missing from agent snapshot`).toContain(
        expected,
      );
    }

    const result = await agent.act({
      steps: [{ ref: "Export", action: "press" }],
    });
    expect(result.ok).toBe(true);
    expect(
      screen.getByRole("dialog", { name: "Export Download Button" }),
    ).toBeInTheDocument();
  });
});
