import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  BotAvatar,
  BOT_AVATAR_SHAPES,
  BOT_BODY_COLORS,
  BOT_EXPRESSIONS,
  DEFAULT_BOT_BODY_COLOR,
  DEFAULT_BOT_SHAPE,
  type AvatarExpression,
  type BotAvatarShape,
} from "../../bot-avatar";
import {
  Component as FluidDropdown,
  type Category as DropdownCategory,
} from "../../ui/fluid-dropdown";
import { WakeSliderField } from "../../ui/wake-slider";
import {
  ComponentDetailLayout,
  ShowcaseToggleField,
  type ShowcaseComponentNavItem,
} from "../ComponentDetailLayout";
import { cn } from "../../../utils/cn";

const SHAPE_CATEGORIES: DropdownCategory[] = BOT_AVATAR_SHAPES.map((s) => ({
  id: s.id,
  label: s.label,
  color: DEFAULT_BOT_BODY_COLOR,
}));

const SHAPE_PATH_BY_ID: Record<string, string> = Object.fromEntries(
  BOT_AVATAR_SHAPES.map((s) => [s.id, s.path])
);

const EXPRESSION_CATEGORIES: DropdownCategory[] = BOT_EXPRESSIONS.map((expr) => ({
  id: expr.id,
  label: expr.label,
  color: DEFAULT_BOT_BODY_COLOR,
}));

const COLOR_CATEGORIES: DropdownCategory[] = BOT_BODY_COLORS.map((c) => ({
  id: c.id,
  label: c.label,
  color: c.hex,
}));

export interface BotAvatarConfig {
  shape: BotAvatarShape;
  expression: AvatarExpression;
  bodyColor: string;
  size: number;
  trackGaze: boolean;
}

export const DEFAULT_BOT_AVATAR_CONFIG: BotAvatarConfig = {
  shape: DEFAULT_BOT_SHAPE,
  expression: "idle",
  bodyColor: DEFAULT_BOT_BODY_COLOR,
  size: 200,
  trackGaze: true,
};

export function buildBotAvatarJsx(config: BotAvatarConfig): string {
  const lines = [
    `import { BotAvatar } from "@/components/bot-avatar";`,
    ``,
    `<BotAvatar`,
    `  shape="${config.shape}"`,
    `  expression="${config.expression}"`,
    `  size={${config.size}}`,
  ];
  if (config.bodyColor.toUpperCase() !== DEFAULT_BOT_BODY_COLOR.toUpperCase()) {
    lines.push(`  bodyColor="${config.bodyColor}"`);
  }
  if (!config.trackGaze) {
    lines.push(`  trackGaze={false}`);
  }
  lines.push(`/>`);
  return lines.join("\n");
}

export interface BotAvatarDemoProps {
  componentList?: ShowcaseComponentNavItem[];
  activeComponentId?: string;
  onSelectComponent?: (id: string) => void;
  onClose?: () => void;
  onOpenInStudio?: () => void;
  config?: BotAvatarConfig;
  onConfigChange?: (next: BotAvatarConfig) => void;
  stageSlotRef?: React.RefObject<HTMLDivElement | null>;
  isClosing?: boolean;
  skipEntranceMotion?: boolean;
}

export const BotAvatarDemo: React.FC<BotAvatarDemoProps> = ({
  componentList,
  activeComponentId,
  onSelectComponent,
  onClose,
  onOpenInStudio,
  config: controlledConfig,
  onConfigChange,
  stageSlotRef,
  isClosing,
  skipEntranceMotion,
}) => {
  const [internalConfig, setInternalConfig] = useState<BotAvatarConfig>(DEFAULT_BOT_AVATAR_CONFIG);
  const config = controlledConfig ?? internalConfig;
  const setConfig = onConfigChange ?? setInternalConfig;
  const patchConfig = (patch: Partial<BotAvatarConfig>) => setConfig({ ...config, ...patch });

  const {
    shape,
    expression,
    bodyColor,
    size,
    trackGaze,
  } = config;

  const setShape = (v: BotAvatarShape) => patchConfig({ shape: v });
  const setExpression = (v: AvatarExpression) => patchConfig({ expression: v });
  const setBodyColor = (v: string) => patchConfig({ bodyColor: v });
  const setSize = (v: number) => patchConfig({ size: v });
  const setTrackGaze = (v: boolean) => patchConfig({ trackGaze: v });

  const [playExpression, setPlayExpression] = useState<AvatarExpression | null>(null);
  const playStepRef = useRef<number>(0);
  const playTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (playTimerRef.current !== null) {
        window.clearTimeout(playTimerRef.current);
      }
    };
  }, []);

  const activeShapeCategory =
    SHAPE_CATEGORIES.find((s) => s.id === shape) ?? SHAPE_CATEGORIES[0];
  const activeExpressionCategory =
    EXPRESSION_CATEGORIES.find((e) => e.id === expression) ??
    EXPRESSION_CATEGORIES[0];
  const activeColorCategory =
    COLOR_CATEGORIES.find(
      (c) => c.color.toUpperCase() === bodyColor.toUpperCase()
    ) ?? COLOR_CATEGORIES[COLOR_CATEGORIES.length - 1];

  const jsxSnippet = useMemo(() => buildBotAvatarJsx(config), [config]);

  const handleReset = () => {
    if (playTimerRef.current !== null) {
      window.clearTimeout(playTimerRef.current);
      playTimerRef.current = null;
    }
    setPlayExpression(null);
    setConfig(DEFAULT_BOT_AVATAR_CONFIG);
  };

  const handlePlay = () => {
    if (playTimerRef.current !== null) {
      window.clearTimeout(playTimerRef.current);
    }
    const candidates: AvatarExpression[] = ["excited", "happy", "wink", "surprised"];
    const pool = candidates.filter((item) => item !== expression);
    const next = pool[playStepRef.current % pool.length];
    playStepRef.current += 1;
    setPlayExpression(next);
    playTimerRef.current = window.setTimeout(() => {
      setPlayExpression(null);
      playTimerRef.current = null;
    }, 1500);
  };

  return (
    <ComponentDetailLayout
      title="Bot Avatar"
      stageBodyClassName=""
      stageSlotRef={stageSlotRef}
      stage={
        stageSlotRef ? undefined : (
          <BotAvatar
            shape={shape}
            expression={playExpression ?? expression}
            bodyColor={bodyColor}
            size={size}
            interactive={true}
            trackGaze={trackGaze}
            enableVibration={true}
          />
        )
      }
      configTitle="Bot Avatar"
      configDescription="Interactive 2.5D SVG avatar with 3D gaze tracking, organic blinking, 7 body shapes, and 10 expressions."
      onReset={handleReset}
      onPlay={handlePlay}
      showCopyPrompt
      codeSnippet={jsxSnippet}
      componentList={componentList}
      activeComponentId={activeComponentId}
      onSelectComponent={onSelectComponent}
      onClose={onClose}
      onOpenInStudio={onOpenInStudio}
      isClosing={isClosing}
      skipEntranceMotion={skipEntranceMotion}
    >
      <div className="flex flex-col gap-2 text-xs">
        {/* Shape Dropdown */}
        <FluidDropdown
          label="Shape"
          categories={SHAPE_CATEGORIES}
          selectedCategory={activeShapeCategory}
          onSelectCategory={(cat) => setShape(cat.id as BotAvatarShape)}
          showDividerAfterFirst={false}
          portal
          triggerClassName="h-11 rounded-xl bg-secondary/80 hover:bg-secondary border-border px-3.5 text-xs text-foreground"
          renderIcon={(cat, { isSelected, inTrigger }) =>
            inTrigger ? null : (
              <svg viewBox="0 0 100 100" className="size-4 mr-2.5 shrink-0">
                <path
                  d={SHAPE_PATH_BY_ID[cat.id]}
                  fill={isSelected ? bodyColor : "currentColor"}
                  fillOpacity={isSelected ? 1 : 0.45}
                />
              </svg>
            )
          }
        />

        {/* Expression Dropdown */}
        <FluidDropdown
          label="Expression"
          categories={EXPRESSION_CATEGORIES}
          selectedCategory={activeExpressionCategory}
          onSelectCategory={(cat) => setExpression(cat.id as AvatarExpression)}
          showDividerAfterFirst={false}
          portal
          triggerClassName="h-11 rounded-xl bg-secondary/80 hover:bg-secondary border-border px-3.5 text-xs text-foreground"
          renderIcon={(_, { isSelected, inTrigger }) =>
            inTrigger ? null : (
              <span
                className={cn(
                  "size-1.5 rounded-full mr-2.5 shrink-0 transition-opacity",
                  isSelected ? "bg-primary opacity-100" : "bg-muted-foreground/40 opacity-0"
                )}
              />
            )
          }
        />

        {/* Body Color Dropdown */}
        <FluidDropdown
          label="Color"
          categories={COLOR_CATEGORIES}
          selectedCategory={activeColorCategory}
          onSelectCategory={(cat) => setBodyColor(cat.color)}
          showDividerAfterFirst={false}
          portal
          triggerClassName="h-11 rounded-xl bg-secondary/80 hover:bg-secondary border-border px-3.5 text-xs text-foreground"
          renderIcon={(cat, { inTrigger }) =>
            inTrigger ? null : (
              <span
                className="size-3.5 rounded-full mr-2.5 shrink-0 ring-1 ring-white/25"
                style={{ backgroundColor: cat.color }}
              />
            )
          }
        />

        {/* Size Slider */}
        <WakeSliderField
          label="Size"
          value={size}
          min={64}
          max={280}
          step={4}
          bars={22}
          unit="px"
          defaultValue={200}
          onChange={setSize}
        />

        <ShowcaseToggleField
          label="Follow"
          checked={trackGaze}
          onCheckedChange={setTrackGaze}
          ariaLabel="Toggle pointer follow"
        />
      </div>
    </ComponentDetailLayout>
  );
};
