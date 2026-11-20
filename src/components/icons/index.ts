import React from "react";
import type { IconProps } from "@animate-ui/react/icons";

import { ArrowDown as RawArrowDown } from "../animate-ui/icons/arrow-down";
import { ArrowLeft as RawArrowLeft } from "../animate-ui/icons/arrow-left";
import { ArrowRight as RawArrowRight } from "../animate-ui/icons/arrow-right";
import { ArrowUp as RawArrowUp } from "../animate-ui/icons/arrow-up";
import { Bookmark as RawBookmark, type BookmarkProps as RawBookmarkProps } from "../animate-ui/icons/bookmark";
import { Check as RawCheck } from "../animate-ui/icons/check";
import { ChevronDown as RawChevronDown } from "../animate-ui/icons/chevron-down";
import { ChevronRight as RawChevronRight } from "../animate-ui/icons/chevron-right";
import { ChevronUp as RawChevronUp } from "../animate-ui/icons/chevron-up";
import { Code as RawCode } from "../animate-ui/icons/code";
import { Copy as RawCopy } from "../animate-ui/icons/copy";
import { Crosshair as RawCrosshair } from "../animate-ui/icons/crosshair";
import { Dices as RawDices } from "../animate-ui/icons/dices";
import { Download as RawDownload } from "../animate-ui/icons/download";
import { EllipsisVertical as RawEllipsisVertical } from "../animate-ui/icons/ellipsis-vertical";
import { Eye as RawEye } from "../animate-ui/icons/eye";
import { EyeOff as RawEyeOff } from "../animate-ui/icons/eye-off";
import { FileText as RawFileText } from "../animate-ui/icons/file-text";
import { GripVertical as RawGripVertical } from "../animate-ui/icons/grip-vertical";
import { Image as RawImage } from "../animate-ui/icons/image";
import { Layers as RawLayers } from "../animate-ui/icons/layers";
import { LayoutGrid as RawLayoutGrid } from "../animate-ui/icons/layout-grid";
import { LifeBuoy as RawLifeBuoy } from "../animate-ui/icons/life-buoy";
import { Loader as RawLoader } from "../animate-ui/icons/loader";
import { Lock as RawLock } from "../animate-ui/icons/lock";
import { LockOpen as RawLockOpen } from "../animate-ui/icons/lock-open";
import { Mail as RawMail } from "../animate-ui/icons/mail";
import { Maximize as RawMaximize } from "../animate-ui/icons/maximize";
import { Moon as RawMoon } from "../animate-ui/icons/moon";
import { Pencil as RawPencil } from "../animate-ui/icons/pencil";
import { Pipette as RawPipette } from "../animate-ui/icons/pipette";
import { Play as RawPlay } from "../animate-ui/icons/play";
import { Plus as RawPlus } from "../animate-ui/icons/plus";
import { RefreshCw as RawRefreshCw } from "../animate-ui/icons/refresh-cw";
import { Search as RawSearch } from "../animate-ui/icons/search";
import { Settings as RawSettings } from "../animate-ui/icons/settings";
import { Share2 as RawShare2 } from "../animate-ui/icons/share-2";
import { SlidersHorizontal as RawSlidersHorizontal } from "../animate-ui/icons/sliders-horizontal";
import { Sparkles as RawSparkles } from "../animate-ui/icons/sparkles";
import { Sun as RawSun } from "../animate-ui/icons/sun";
import { Terminal as RawTerminal } from "../animate-ui/icons/terminal";
import { Trash2 as RawTrash2 } from "../animate-ui/icons/trash-2";
import { X as RawX } from "../animate-ui/icons/x";

export {
  AsteriskSymbol,
  type AsteriskSymbolProps,
} from "./AsteriskSymbol";
export {
  ClaudeIcon,
  CopilotIcon,
  CursorIcon,
  GeminiIcon,
  OpenAIIcon,
  V0Icon,
  type AiAgentIconProps,
} from "./AiAgentIcons";
export {
  FigmaIcon,
  GitHubIcon,
  LinearIcon,
  RaycastIcon,
  SupabaseIcon,
  VercelIcon,
  type CompanyIconProps,
} from "./CompanyIcons";

export type AnimatedIconProps = IconProps<string>;

export type BookmarkCompatProps = RawBookmarkProps & {
  active?: boolean;
};

function withAnimateDefaults<P extends IconProps<any>>(
  Component: React.ComponentType<P>,
  displayName: string,
  defaults?: { animate?: boolean; loop?: boolean; animateOnHover?: boolean }
): React.FC<IconProps<any>> {
  const Wrapped: React.FC<IconProps<any>> = ({
    size = 16,
    animate,
    animateOnHover,
    animateOnTap,
    animateOnView,
    loop,
    ...rest
  }) => {
    const hasExplicitTrigger =
      animate !== undefined ||
      animateOnHover !== undefined ||
      animateOnTap !== undefined ||
      animateOnView !== undefined ||
      defaults?.animate !== undefined;

    return React.createElement(Component, {
      ...(rest as P),
      size,
      animate: animate ?? defaults?.animate,
      animateOnHover:
        animateOnHover ??
        (hasExplicitTrigger ? undefined : defaults?.animateOnHover ?? true),
      animateOnTap,
      animateOnView,
      loop: loop ?? defaults?.loop,
    });
  };
  Wrapped.displayName = displayName;
  return Wrapped;
}

export const Add01 = withAnimateDefaults(RawPlus, "Add01");
export const ArrowDown01 = withAnimateDefaults(RawArrowDown, "ArrowDown01");
export const ChevronDown = withAnimateDefaults(RawChevronDown, "ChevronDown");
export const ArrowLeft01 = withAnimateDefaults(RawArrowLeft, "ArrowLeft01");
export const ArrowRight01 = withAnimateDefaults(RawArrowRight, "ArrowRight01");
export const ChevronRight = withAnimateDefaults(RawChevronRight, "ChevronRight");
export const ArrowUp01 = withAnimateDefaults(RawArrowUp, "ArrowUp01");
export const ChevronUp = withAnimateDefaults(RawChevronUp, "ChevronUp");
export const Bookmark: React.FC<BookmarkCompatProps> = ({
  size = 16,
  active,
  animate,
  animateOnHover,
  ...rest
}) => {
  const resolvedAnimate =
    animate !== undefined ? animate : active !== undefined ? (active ? "fill" : false) : undefined;
  return React.createElement(RawBookmark, {
    ...rest,
    size,
    animate: resolvedAnimate,
    animateOnHover:
      animateOnHover ?? (resolvedAnimate !== undefined ? undefined : true),
  });
};
Bookmark.displayName = "Bookmark";
export const Cancel01 = withAnimateDefaults(RawX, "Cancel01");
export const Check = withAnimateDefaults(RawCheck, "Check");
export const Code01 = withAnimateDefaults(RawCode, "Code01");
export const Terminal = withAnimateDefaults(RawTerminal, "Terminal");
export const Copy01 = withAnimateDefaults(RawCopy, "Copy01");
export const Delete02 = withAnimateDefaults(RawTrash2, "Delete02");
export const Dices = withAnimateDefaults(RawDices, "Dices");
export const Download04 = withAnimateDefaults(RawDownload, "Download04");
export const DragDropVertical = withAnimateDefaults(
  RawGripVertical,
  "DragDropVertical"
);
export const File02 = withAnimateDefaults(RawFileText, "File02");
export const Grid = withAnimateDefaults(RawLayoutGrid, "Grid");
export const Image01 = withAnimateDefaults(RawImage, "Image01");
export const Layers01 = withAnimateDefaults(RawLayers, "Layers01");
export const LifeBuoy = withAnimateDefaults(RawLifeBuoy, "LifeBuoy");
export const Loading01 = withAnimateDefaults(RawLoader, "Loading01", {
  animate: true,
  loop: true,
});
export const Lock = withAnimateDefaults(RawLock, "Lock");
export const LockUnlock = withAnimateDefaults(RawLockOpen, "LockUnlock");
export const Mail = withAnimateDefaults(RawMail, "Mail");
export const Maximize = withAnimateDefaults(RawMaximize, "Maximize");
export const Moon = withAnimateDefaults(RawMoon, "Moon");
export const MoreVertical = withAnimateDefaults(
  RawEllipsisVertical,
  "MoreVertical"
);
export const Pencil = withAnimateDefaults(RawPencil, "Pencil");
export const Pipette = withAnimateDefaults(RawPipette, "Pipette");
export const Play = withAnimateDefaults(RawPlay, "Play");
export const Refresh = withAnimateDefaults(RawRefreshCw, "Refresh");
export const Search01 = withAnimateDefaults(RawSearch, "Search01");
export const Settings02 = withAnimateDefaults(RawSettings, "Settings02");
export const Settings2 = withAnimateDefaults(RawSlidersHorizontal, "Settings2");
export const Share01 = withAnimateDefaults(RawShare2, "Share01");
export const Sparkles = withAnimateDefaults(RawSparkles, "Sparkles");
export const Sun = withAnimateDefaults(RawSun, "Sun");
export const Target02 = withAnimateDefaults(RawCrosshair, "Target02");
export const View = withAnimateDefaults(RawEye, "View");
export const ViewOff = withAnimateDefaults(RawEyeOff, "ViewOff");

export {
  Add01 as Add01Icon,
  Add01 as Plus,
  ArrowDown01 as ArrowDown01Icon,
  ArrowDown01 as ArrowDown,
  ArrowLeft01 as ArrowLeft01Icon,
  ArrowLeft01 as ArrowLeft,
  ArrowRight01 as ArrowRight01Icon,
  ArrowRight01 as ArrowRight,
  ArrowUp01 as ArrowUp01Icon,
  ArrowUp01 as ArrowUp,
  Cancel01 as Cancel01Icon,
  Cancel01 as X,
  Cancel01 as Close,
  Check as CheckIcon,
  Code01 as Code01Icon,
  Code01 as Code,
  Code01 as Code2,
  Copy01 as Copy01Icon,
  Copy01 as Copy,
  Delete02 as Delete02Icon,
  Delete02 as Trash,
  Delete02 as TrashIcon,
  Dices as DicesIcon,
  Download04 as Download04Icon,
  Download04 as Download,
  DragDropVertical as DragDropVerticalIcon,
  DragDropVertical as GripVertical,
  DragDropVertical as Grip,
  File02 as File02Icon,
  File02 as FileCode,
  File02 as FileJson,
  Grid as GridIcon,
  Grid as LayoutGrid,
  Image01 as Image01Icon,
  Image01 as Image,
  Image01 as ImageIcon,
  Layers01 as Layers01Icon,
  Layers01 as Layers,
  Loading01 as Loading01Icon,
  Loading01 as Loader2,
  Loading01 as Loading,
  Lock as LockIcon,
  LockUnlock as LockUnlockIcon,
  LockUnlock as Unlock,
  Maximize as MaximizeIcon,
  Maximize as Maximize2,
  MoreVertical as MoreVerticalIcon,
  MoreVertical as MoreVertical01,
  Pipette as PipetteIcon,
  Play as PlayIcon,
  Refresh as RefreshIcon,
  Refresh as RefreshCw,
  Search01 as Search01Icon,
  Search01 as Search,
  Settings02 as Settings02Icon,
  Settings02 as Settings,
  Share01 as Share01Icon,
  Share01 as Share2,
  Share01 as Share,
  Sparkles as SparklesIcon,
  Target02 as Target02Icon,
  Target02 as Crosshair,
  View as ViewIcon,
  View as Eye,
  ViewOff as ViewOffIcon,
  ViewOff as EyeOff,
};
