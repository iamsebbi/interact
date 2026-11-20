export type AvatarExpression =
  | 'idle'
  | 'happy'
  | 'excited'
  | 'wink'
  | 'focused'
  | 'confused'
  | 'surprised'
  | 'angry'
  | 'sleepy'
  | 'loading';

export type BotAvatarShape =
  | 'squircle'
  | 'cloud'
  | 'drop'
  | 'triangle'
  | 'cube'
  | 'berry'
  | 'circle';

export interface BotBodyColor {
  id: string;
  hex: string;
  label: string;
}

export interface BotSurfaceProfile {
  centerX: number;
  centerY: number;
  rx: number;
  ry: number;
  yaw0: number;
  pitch0: number;
  roll0: number;
  maxYaw: number;
  maxPitch: number;
  eyeLonDeg: number;
  eyeLatDeg: number;
  flatness: number;
  topTaper: number;
}

export interface BotShapeDefinition {
  id: BotAvatarShape;
  label: string;
  path: string;
  eyeOffset: { x: number; y: number };
  eyeScale?: number;
  eyeTilt?: number;
  surface: BotSurfaceProfile;
}

export const BOT_BODY_COLORS: readonly BotBodyColor[] = [
  { id: 'coral', hex: '#FE4A49', label: 'Coral Red' },
  { id: 'cyan', hex: '#2AB7CA', label: 'Cyan' },
  { id: 'yellow', hex: '#FED766', label: 'Yellow' },
  { id: 'green', hex: '#71B340', label: 'Green' },
  { id: 'crimson', hex: '#A40E4C', label: 'Crimson' },
  { id: 'orange', hex: '#F85A3E', label: 'Orange' },
  { id: 'pink', hex: '#FF4F79', label: 'Pink' },
] as const;

export const BOT_AVATAR_SHAPES: readonly BotShapeDefinition[] = [
  {
    id: 'squircle',
    label: 'Squircle',
    path: 'M 37.78 12.40 H 62.22 C 72.09 12.40, 78.39 13.90, 82.24 17.76 C 86.10 21.61, 87.60 27.91, 87.60 37.78 V 62.22 C 87.60 72.09, 86.10 78.39, 82.24 82.24 C 78.39 86.10, 72.09 87.60, 62.22 87.60 H 37.78 C 27.91 87.60, 21.61 86.10, 17.76 82.24 C 13.90 78.39, 12.40 72.09, 12.40 62.22 V 37.78 C 12.40 27.91, 13.90 21.61, 17.76 17.76 C 21.61 13.90, 27.91 12.40, 37.78 12.40 Z',
    eyeOffset: { x: 0, y: 0 },
    eyeScale: 1.07,
    eyeTilt: 0,
    surface: {
      centerX: 50,
      centerY: 51,
      rx: 38,
      ry: 38,
      yaw0: 0,
      pitch0: -2,
      roll0: 0,
      maxYaw: 24,
      maxPitch: 21,
      eyeLonDeg: 17.5,
      eyeLatDeg: -2,
      flatness: 0.65,
      topTaper: 0,
    },
  },
  {
    id: 'cloud',
    label: 'Cloud',
    path: 'M 25.87 31.13 A 23.92 24.84 0 0 1 72.32 32.18 A 19.76 20.52 0 0 1 80.66 71.56 A 19.76 20.52 0 0 1 50.01 83.46 A 19.76 20.52 0 0 1 19.12 70.37 A 19.76 20.52 0 0 1 25.87 31.13 Z',
    eyeOffset: { x: -2, y: 1 },
    eyeScale: 1.03,
    eyeTilt: 0,
    surface: {
      centerX: 48.5,
      centerY: 52.5,
      rx: 41,
      ry: 34,
      yaw0: 0,
      pitch0: -2,
      roll0: 0,
      maxYaw: 24,
      maxPitch: 19,
      eyeLonDeg: 16,
      eyeLatDeg: -1.5,
      flatness: 0.38,
      topTaper: 0.12,
    },
  },
  {
    id: 'drop',
    label: 'Drop',
    path: 'M 50.00 7.88 C 60.35 7.88, 86.80 38.12, 86.80 59.72 C 86.80 78.80, 70.32 92.12, 50.00 92.12 C 29.68 92.12, 13.20 78.80, 13.20 59.72 C 13.20 38.12, 39.65 7.88, 50.00 7.88 Z',
    eyeOffset: { x: 4, y: 6 },
    eyeScale: 0.99,
    eyeTilt: 0,
    surface: {
      centerX: 53.5,
      centerY: 57,
      rx: 36,
      ry: 35,
      yaw0: 4,
      pitch0: -2,
      roll0: 0,
      maxYaw: 22,
      maxPitch: 20,
      eyeLonDeg: 17.5,
      eyeLatDeg: 0,
      flatness: 0.15,
      topTaper: 0.36,
    },
  },
  {
    id: 'triangle',
    label: 'Triangle',
    path: 'M 30.45 26.40 C 43.16 3.29, 56.84 3.29, 69.55 26.40 C 74.98 36.28, 80.58 46.45, 86.00 56.33 C 98.37 78.82, 91.12 90.93, 65.30 90.93 C 55.20 90.93, 44.80 90.93, 34.70 90.93 C 8.88 90.93, 1.63 78.82, 14.00 56.33 C 19.42 46.45, 25.02 36.28, 30.45 26.40 Z',
    eyeOffset: { x: -1, y: 11 },
    eyeScale: 1.01,
    eyeTilt: -5,
    surface: {
      centerX: 49,
      centerY: 62.5,
      rx: 39,
      ry: 31,
      yaw0: 0,
      pitch0: -2,
      roll0: -5,
      maxYaw: 21,
      maxPitch: 18,
      eyeLonDeg: 16.5,
      eyeLatDeg: 0,
      flatness: 0.35,
      topTaper: 0.42,
    },
  },
  {
    id: 'cube',
    label: 'Cube',
    path: 'M 37.46 12.31 Q 44.45 8.92, 52.11 10.23 L 82.30 15.38 Q 89.96 16.69, 89.96 24.46 L 89.96 66.64 Q 89.96 74.41, 83.01 77.89 L 63.61 87.59 Q 56.66 91.06, 49.00 89.79 L 17.70 84.57 Q 10.04 83.29, 10.04 75.52 L 10.04 33.34 Q 10.04 25.57, 17.03 22.19 Z',
    eyeOffset: { x: -8, y: 8 },
    eyeScale: 1.01,
    eyeTilt: 0,
    surface: {
      centerX: 43,
      centerY: 59,
      rx: 32,
      ry: 33,
      yaw0: -4,
      pitch0: -4,
      roll0: 0,
      maxYaw: 16,
      maxPitch: 18,
      eyeLonDeg: 18.5,
      eyeLatDeg: 0,
      flatness: 0.78,
      topTaper: 0,
    },
  },
  {
    id: 'berry',
    label: 'Berry',
    path: 'M 34.90 18.37 A 19.44 19.44 0 0 1 70.14 19.93 A 19.44 19.44 0 0 1 86.88 52.48 A 19.44 19.44 0 0 1 66.05 81.89 A 19.44 19.44 0 0 1 30.87 79.92 A 19.44 19.44 0 0 1 13.12 47.53 A 19.44 19.44 0 0 1 34.90 18.37 Z',
    eyeOffset: { x: -2, y: 0 },
    eyeScale: 1.02,
    eyeTilt: 0,
    surface: {
      centerX: 48.5,
      centerY: 51.5,
      rx: 40,
      ry: 40,
      yaw0: -3,
      pitch0: -2,
      roll0: 0,
      maxYaw: 24,
      maxPitch: 21,
      eyeLonDeg: 16.5,
      eyeLatDeg: -1.5,
      flatness: 0.22,
      topTaper: 0,
    },
  },
  {
    id: 'circle',
    label: 'Circle',
    path: 'M 50.00 9.05 A 40.95 40.95 0 1 1 50.00 90.95 A 40.95 40.95 0 1 1 50.00 9.05 Z',
    eyeOffset: { x: 10, y: 5 },
    eyeScale: 1.02,
    eyeTilt: -12,
    surface: {
      centerX: 50,
      centerY: 50,
      rx: 40.95,
      ry: 40.95,
      yaw0: 15,
      pitch0: -5.5,
      roll0: -12,
      maxYaw: 24,
      maxPitch: 21,
      eyeLonDeg: 16.5,
      eyeLatDeg: 2.5,
      flatness: 0,
      topTaper: 0,
    },
  },
] as const;

export const DEFAULT_BOT_BODY_COLOR = '#FF4F79';
export const DEFAULT_BOT_SHAPE: BotAvatarShape = 'circle';
export const BOT_EYE_COLOR = '#262626';

export const BOT_EXPRESSIONS: readonly { id: AvatarExpression; label: string }[] = [
  { id: 'idle', label: 'Idle' },
  { id: 'happy', label: 'Happy' },
  { id: 'excited', label: 'Excited' },
  { id: 'wink', label: 'Wink' },
  { id: 'focused', label: 'Focus' },
  { id: 'confused', label: 'Confused' },
  { id: 'surprised', label: 'Alert' },
  { id: 'angry', label: 'Angry' },
  { id: 'sleepy', label: 'Sleepy' },
  { id: 'loading', label: 'Loading' },
] as const;

export function parseAvatarSetting(raw?: string): { color: string; shape: BotAvatarShape } {
  if (!raw) {
    return { color: DEFAULT_BOT_BODY_COLOR, shape: DEFAULT_BOT_SHAPE };
  }
  const [rawColor, rawShape] = raw.split(':');
  const normalizedColor = (rawColor || '').trim().toUpperCase();
  const matchedColor = BOT_BODY_COLORS.find((c) => c.hex.toUpperCase() === normalizedColor);
  const matchedShape = BOT_AVATAR_SHAPES.find((s) => s.id === rawShape?.trim());

  return {
    color: matchedColor ? matchedColor.hex : DEFAULT_BOT_BODY_COLOR,
    shape: matchedShape ? matchedShape.id : DEFAULT_BOT_SHAPE,
  };
}

export function formatAvatarSetting(color: string, shape: BotAvatarShape): string {
  return `${color}:${shape}`;
}
