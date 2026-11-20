# BotAvatar (Standalone Portable Module)

Self-contained interactive 2.5D SVG bot avatar with 3D surface gaze projection, randomized organic blinking, and multi-expression morphing.

## Dependencies

- `react` (>= 18)
- `motion` (`motion/react`)

No Tailwind CSS, external utility imports, or app-specific CSS tokens are required. Copy the entire `bot-avatar/` folder into any React project and import from `./bot-avatar`.

## Quick Usage

```tsx
import { BotAvatar, BOT_BODY_COLORS, BOT_AVATAR_SHAPES } from './bot-avatar';

export function Demo() {
  return (
    <BotAvatar
      shape="squircle"
      expression="idle"
      bodyColor={BOT_BODY_COLORS[0].hex}
      size={180}
    />
  );
}
```

## Props

- `expression`: `'idle' | 'happy' | 'excited' | 'wink' | 'focused' | 'confused' | 'surprised' | 'angry' | 'sleepy' | 'loading'`
- `shape`: `'squircle' | 'cloud' | 'drop' | 'triangle' | 'cube' | 'berry' | 'circle'`
- `bodyColor` / `eyeColor`: hex or CSS color strings
- `size`: SVG size in px (`180` default)
- `interactive`: enables tap bounce, long-press pet (`happy`), 4-tap poke annoyance (`angry`), sleepy wake-up startle (`true` default)
- `interactivePadding`: padding in px around the interactive button wrapper (`16` default; use `0`–`6` inside tight cards/badges)
- `trackGaze`: enables proximity pointer/cursor 3D surface eye & head tracking (`true` default)
- `enableVibration`: uses `navigator.vibrate` when `onHaptic` is not provided (`true` default)
- `onHaptic`: optional custom haptic handler `(pattern: number | number[]) => void`
- `onTap`: optional tap callback
- `ariaLabel`: accessible label
- `className` / `buttonClassName`: optional extra classes for SVG / interactive button

## Optional CSS Variables

If defined on `:root` or a parent container, the avatar automatically picks up:
- `--glass-edge` (default: `rgba(255, 255, 255, 0.18)`)
- `--glass-contact` (default: `rgba(0, 0, 0, 0.14)`)
- `--glass-shade` (default: `rgba(0, 0, 0, 0.28)`)
