import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  BotAvatar,
  BOT_AVATAR_SHAPES,
  BOT_EXPRESSIONS,
  DEFAULT_BOT_BODY_COLOR,
  DEFAULT_BOT_SHAPE,
  type AvatarExpression,
  type BotAvatarShape,
  type BotShapeDefinition,
} from "../../bot-avatar";
import { WakeSliderField } from "../../ui/wake-slider";
import {
  ComponentDetailLayout,
  ShowcaseSection,
  ShowcaseToggleField,
  type ShowcaseComponentNavItem,
} from "../ComponentDetailLayout";
import { cn } from "../../../utils/cn";

const PANEL_SHAPE_IDS: readonly BotAvatarShape[] = ["circle", "squircle", "berry"];
const PANEL_EXPRESSION_IDS: readonly AvatarExpression[] = ["idle", "happy", "sleepy"];

const PANEL_SHAPES: BotShapeDefinition[] = PANEL_SHAPE_IDS.map((id) =>
  BOT_AVATAR_SHAPES.find((shapeDef) => shapeDef.id === id)
).filter((shapeDef): shapeDef is BotShapeDefinition => Boolean(shapeDef));

const PANEL_EXPRESSIONS = PANEL_EXPRESSION_IDS.map((id) =>
  BOT_EXPRESSIONS.find((expr) => expr.id === id)
).filter((expr): expr is (typeof BOT_EXPRESSIONS)[number] => Boolean(expr));

export interface BotAvatarConfig {
  shape: BotAvatarShape;
  expression: AvatarExpression;
  size: number;
  trackGaze: boolean;
}

export const DEFAULT_BOT_AVATAR_CONFIG: BotAvatarConfig = {
  shape: DEFAULT_BOT_SHAPE,
  expression: "idle",
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
    size,
    trackGaze,
  } = config;

  const setShape = (v: BotAvatarShape) => patchConfig({ shape: v });
  const setExpression = (v: AvatarExpression) => patchConfig({ expression: v });
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

  const activeShapeDef =
    BOT_AVATAR_SHAPES.find((s) => s.id === shape) ?? BOT_AVATAR_SHAPES[0];
  const activeExpressionDef =
    BOT_EXPRESSIONS.find((e) => e.id === expression) ?? BOT_EXPRESSIONS[0];

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
            bodyColor={DEFAULT_BOT_BODY_COLOR}
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
      {/* Shape Picker */}
      <ShowcaseSection
        label={`Body Shape (${PANEL_SHAPES.length})`}
        valueLabel={activeShapeDef.label}
      >
        <div className="grid grid-cols-3 gap-1.5">
          {PANEL_SHAPES.map((item) => {
            const isSelected = item.id === shape;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setShape(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-xl border text-[11px] font-medium transition-all cursor-pointer",
                  isSelected
                    ? "glass-chosen text-foreground"
                    : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <svg viewBox="0 0 100 100" className="size-5 shrink-0">
                  <path
                    d={item.path}
                    fill={isSelected ? DEFAULT_BOT_BODY_COLOR : "currentColor"}
                    fillOpacity={isSelected ? 1 : 0.35}
                  />
                </svg>
                <span className="truncate max-w-full">{item.label}</span>
              </button>
            );
          })}
        </div>
      </ShowcaseSection>

      {/* Expression Picker */}
      <ShowcaseSection
        label={`Expression (${PANEL_EXPRESSIONS.length})`}
        valueLabel={activeExpressionDef.label}
      >
        <div className="grid grid-cols-3 gap-1.5">
          {PANEL_EXPRESSIONS.map((item) => {
            const isSelected = item.id === expression;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setExpression(item.id)}
                className={cn(
                  "h-8 px-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-center",
                  isSelected
                    ? "glass-chosen text-foreground font-semibold"
                    : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </ShowcaseSection>

      {/* Dimensions & Behavior Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 text-xs">
        {/* Size Slider */}
        <WakeSliderField
          label="Size"
          value={size}
          min={64}
          max={280}
          step={4}
          unit="px"
          defaultValue={200}
          onChange={setSize}
        />

        <ShowcaseToggleField
          label="3D Gaze Tracking"
          checked={trackGaze}
          onCheckedChange={setTrackGaze}
          ariaLabel="Toggle 3D gaze tracking"
        />
      </div>
    </ComponentDetailLayout>
  );
};
