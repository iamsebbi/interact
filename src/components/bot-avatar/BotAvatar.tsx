import React, { useEffect, useId, useRef, useState } from 'react';
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type AnimationPlaybackControls,
} from 'motion/react';
import {
  BOT_AVATAR_SHAPES,
  BOT_EYE_COLOR,
  DEFAULT_BOT_BODY_COLOR,
  DEFAULT_BOT_SHAPE,
  type AvatarExpression,
  type BotAvatarShape,
  type BotSurfaceProfile,
} from './botAvatarConfig';

export type {
  AvatarExpression,
  BotAvatarShape,
  BotBodyColor,
  BotShapeDefinition,
  BotSurfaceProfile,
} from './botAvatarConfig';

const BODY_IDLE_MOTION: Record<
  AvatarExpression,
  {
    animate: {
      x: number | number[];
      y: number | number[];
      rotate: number | number[];
      scaleX: number | number[];
      scaleY: number | number[];
    };
    transition: Record<string, unknown>;
  }
> = {
  idle: {
    animate: {
      x: [0, 0, 3.6, 3.6, -3.6, -3.6, -2.0, -2.0, 0, 0],
      y: [0, -1.5, -4.0, -3.0, 1.2, 0.5, -3.2, -2.4, 0, 0],
      rotate: [0, -0.5, 3.8, 3.2, -4.0, -3.4, -2.4, -1.8, 0.4, 0],
      scaleX: [1, 1.01, 0.985, 1, 0.985, 1, 0.99, 1, 1.005, 1],
      scaleY: [1, 0.99, 1.02, 1, 1.02, 1, 1.015, 1, 0.995, 1],
    },
    transition: {
      x: {
        duration: 8.4,
        times: [0, 0.17, 0.25, 0.43, 0.51, 0.69, 0.75, 0.88, 0.95, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      y: {
        duration: 8.4,
        times: [0, 0.17, 0.25, 0.43, 0.51, 0.69, 0.75, 0.88, 0.95, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      rotate: {
        duration: 8.4,
        times: [0, 0.17, 0.25, 0.43, 0.51, 0.69, 0.75, 0.88, 0.95, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      scaleX: {
        duration: 8.4,
        times: [0, 0.17, 0.25, 0.43, 0.51, 0.69, 0.75, 0.88, 0.95, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      scaleY: {
        duration: 8.4,
        times: [0, 0.17, 0.25, 0.43, 0.51, 0.69, 0.75, 0.88, 0.95, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  happy: {
    animate: {
      x: 0,
      y: [0, -7, 0],
      rotate: [-2.8, 2.8, -2.8],
      scaleX: [1.02, 0.98, 1.02],
      scaleY: [0.98, 1.03, 0.98],
    },
    transition: {
      x: { duration: 0.25 },
      y: { duration: 1.9, repeat: Infinity, ease: 'easeInOut' },
      rotate: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
      scaleX: { duration: 1.9, repeat: Infinity, ease: 'easeInOut' },
      scaleY: { duration: 1.9, repeat: Infinity, ease: 'easeInOut' },
    },
  },
  excited: {
    animate: {
      x: 0,
      y: [0, -8.5, 1.5, -6, 0],
      rotate: [0, -3.6, 3.6, -2.2, 0],
      scaleX: [1, 0.955, 1.045, 0.97, 1],
      scaleY: [1, 1.055, 0.955, 1.035, 1],
    },
    transition: {
      x: { duration: 0.22 },
      y: { duration: 1.45, repeat: Infinity, ease: 'easeInOut' },
      rotate: { duration: 1.45, repeat: Infinity, ease: 'easeInOut' },
      scaleX: { duration: 1.45, repeat: Infinity, ease: 'easeInOut' },
      scaleY: { duration: 1.45, repeat: Infinity, ease: 'easeInOut' },
    },
  },
  wink: {
    animate: {
      x: [0, 2.5, 0],
      y: [0, -4.5, 0],
      rotate: [1.5, 4.5, 1.5],
      scaleX: 1,
      scaleY: 1,
    },
    transition: {
      x: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
      y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
      rotate: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
      scaleX: { duration: 0.2 },
      scaleY: { duration: 0.2 },
    },
  },
  focused: {
    animate: {
      x: [-2.5, 2.5, -2.5],
      y: [0, -2, 0],
      rotate: [-2.2, 2.2, -2.2],
      scaleX: 1,
      scaleY: 1,
    },
    transition: {
      x: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
      y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
      rotate: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
      scaleX: { duration: 0.2 },
      scaleY: { duration: 0.2 },
    },
  },
  confused: {
    animate: {
      x: [0, -1.8, -1.8, 1.4, 1.4, 0],
      y: [0, -1.0, -1.0, 0, 0, 0],
      rotate: [0, -4.8, -4.2, 3.2, 2.8, 0],
      scaleX: 1,
      scaleY: 1,
    },
    transition: {
      x: {
        duration: 5.4,
        times: [0, 0.18, 0.48, 0.64, 0.86, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      y: {
        duration: 5.4,
        times: [0, 0.18, 0.48, 0.64, 0.86, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      rotate: {
        duration: 5.4,
        times: [0, 0.18, 0.48, 0.64, 0.86, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      scaleX: { duration: 0.22 },
      scaleY: { duration: 0.22 },
    },
  },
  surprised: {
    animate: {
      x: 0,
      y: [0, -7, -2, -4, 0],
      rotate: [0, -2.5, 2, 0],
      scaleX: [1, 0.96, 1.02, 1],
      scaleY: [1, 1.05, 0.98, 1],
    },
    transition: {
      x: { duration: 0.2 },
      y: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
      rotate: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
      scaleX: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
      scaleY: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
    },
  },
  angry: {
    animate: {
      x: [0, 0, -2.4, -2.4, 2.4, 2.4, 0, 0],
      y: [0, 1.6, 0.8, 1.8, 0.8, 1.8, 1.2, 0],
      rotate: [0, -1.5, -3.0, -2.4, 3.0, 2.4, -0.8, 0],
      scaleX: [1, 1.03, 1.01, 1.035, 1.01, 1.035, 1.015, 1],
      scaleY: [1, 0.968, 0.99, 0.962, 0.99, 0.962, 0.985, 1],
    },
    transition: {
      x: {
        duration: 5.4,
        times: [0, 0.16, 0.24, 0.44, 0.54, 0.74, 0.86, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      y: {
        duration: 5.4,
        times: [0, 0.16, 0.24, 0.44, 0.54, 0.74, 0.86, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      rotate: {
        duration: 5.4,
        times: [0, 0.16, 0.24, 0.44, 0.54, 0.74, 0.86, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      scaleX: {
        duration: 5.4,
        times: [0, 0.16, 0.24, 0.44, 0.54, 0.74, 0.86, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      scaleY: {
        duration: 5.4,
        times: [0, 0.16, 0.24, 0.44, 0.54, 0.74, 0.86, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  sleepy: {
    animate: {
      x: 0,
      y: [0, 3.6, 0],
      scaleX: [1, 1.03, 1],
      scaleY: [1, 0.962, 1],
      rotate: [0, -1.8, 0, 1.8, 0],
    },
    transition: {
      x: { duration: 0.2 },
      y: { duration: 4.6, repeat: Infinity, ease: 'easeInOut' },
      scaleX: { duration: 4.6, repeat: Infinity, ease: 'easeInOut' },
      scaleY: { duration: 4.6, repeat: Infinity, ease: 'easeInOut' },
      rotate: { duration: 7.2, repeat: Infinity, ease: 'easeInOut' },
    },
  },
  loading: {
    animate: { x: 0, y: [0, -2.5, 0], rotate: 0, scaleX: 1, scaleY: 1 },
    transition: {
      x: { duration: 0.2 },
      y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
      rotate: { duration: 0.2 },
      scaleX: { duration: 0.2 },
      scaleY: { duration: 0.2 },
    },
  },
};

type FacialExpression = Exclude<AvatarExpression, 'loading'>;

interface EyePose {
  leftPath: string;
  rightPath: string;
}

const EYE_POSES: Record<FacialExpression, EyePose> = {
  idle: {
    leftPath:
      'M 32.80 46.70 C 32.80 43.55, 35.35 41.00, 38.50 41.00 C 38.50 41.00, 38.50 41.00, 38.50 41.00 C 41.65 41.00, 44.20 43.55, 44.20 46.70 C 44.20 50.90, 44.20 55.10, 44.20 59.30 C 44.20 62.45, 41.65 65.00, 38.50 65.00 C 38.50 65.00, 38.50 65.00, 38.50 65.00 C 35.35 65.00, 32.80 62.45, 32.80 59.30 C 32.80 55.10, 32.80 50.90, 32.80 46.70 Z',
    rightPath:
      'M 55.80 46.70 C 55.80 43.55, 58.35 41.00, 61.50 41.00 C 61.50 41.00, 61.50 41.00, 61.50 41.00 C 64.65 41.00, 67.20 43.55, 67.20 46.70 C 67.20 50.90, 67.20 55.10, 67.20 59.30 C 67.20 62.45, 64.65 65.00, 61.50 65.00 C 61.50 65.00, 61.50 65.00, 61.50 65.00 C 58.35 65.00, 55.80 62.45, 55.80 59.30 C 55.80 55.10, 55.80 50.90, 55.80 46.70 Z',
  },
  happy: {
    leftPath:
      'M 29.44 57.75 C 28.76 56.76, 28.72 55.46, 29.33 54.42 C 33.25 47.79, 43.75 47.79, 47.67 54.42 C 48.28 55.46, 48.24 56.76, 47.56 57.75 C 47.04 58.51, 46.21 59.00, 45.30 59.09 C 44.10 59.20, 42.94 58.61, 42.33 57.58 C 40.69 54.81, 36.31 54.81, 34.67 57.58 C 34.06 58.61, 32.90 59.20, 31.70 59.09 C 30.79 59.00, 29.96 58.51, 29.44 57.75 Z',
    rightPath:
      'M 52.44 57.75 C 51.76 56.76, 51.72 55.46, 52.33 54.42 C 56.25 47.79, 66.75 47.79, 70.67 54.42 C 71.28 55.46, 71.24 56.76, 70.56 57.75 C 70.04 58.51, 69.21 59.00, 68.30 59.09 C 67.10 59.20, 65.94 58.61, 65.33 57.58 C 63.69 54.81, 59.31 54.81, 57.67 57.58 C 57.06 58.61, 55.90 59.20, 54.70 59.09 C 53.79 59.00, 52.96 58.51, 52.44 57.75 Z',
  },
  excited: {
    leftPath:
      'M 32.27 44.76 C 32.64 41.25, 35.79 38.70, 39.31 39.07 C 39.31 39.07, 39.31 39.07, 39.31 39.07 C 42.82 39.44, 45.37 42.59, 45.00 46.10 C 44.58 50.15, 44.15 54.19, 43.73 58.24 C 43.36 61.75, 40.21 64.30, 36.69 63.93 C 36.69 63.93, 36.69 63.93, 36.69 63.93 C 33.18 63.56, 30.63 60.41, 31.00 56.90 C 31.42 52.85, 31.85 48.81, 32.27 44.76 Z',
    rightPath:
      'M 55.00 46.10 C 54.63 42.59, 57.18 39.44, 60.69 39.07 C 60.69 39.07, 60.69 39.07, 60.69 39.07 C 64.21 38.70, 67.36 41.25, 67.73 44.76 C 68.15 48.81, 68.58 52.85, 69.00 56.90 C 69.37 60.41, 66.82 63.56, 63.31 63.93 C 63.31 63.93, 63.31 63.93, 63.31 63.93 C 59.79 64.30, 56.64 61.75, 56.27 58.24 C 55.85 54.19, 55.42 50.15, 55.00 46.10 Z',
  },
  wink: {
    leftPath:
      'M 32.80 46.70 C 32.80 43.55, 35.35 41.00, 38.50 41.00 C 38.50 41.00, 38.50 41.00, 38.50 41.00 C 41.65 41.00, 44.20 43.55, 44.20 46.70 C 44.20 50.90, 44.20 55.10, 44.20 59.30 C 44.20 62.45, 41.65 65.00, 38.50 65.00 C 38.50 65.00, 38.50 65.00, 38.50 65.00 C 35.35 65.00, 32.80 62.45, 32.80 59.30 C 32.80 55.10, 32.80 50.90, 32.80 46.70 Z',
    rightPath:
      'M 52.38 56.46 C 51.81 55.44, 51.89 54.19, 52.57 53.24 C 56.96 47.16, 66.04 47.16, 70.43 53.24 C 71.11 54.19, 71.19 55.44, 70.62 56.46 C 70.19 57.24, 69.44 57.78, 68.56 57.95 C 67.42 58.17, 66.25 57.70, 65.57 56.76 C 63.57 53.99, 59.43 53.99, 57.43 56.76 C 56.75 57.70, 55.58 58.17, 54.44 57.95 C 53.56 57.78, 52.81 57.24, 52.38 56.46 Z',
  },
  focused: {
    leftPath:
      'M 33.61 49.29 C 34.20 46.25, 37.14 44.27, 40.18 44.86 C 40.18 44.86, 40.18 44.86, 40.18 44.86 C 43.22 45.45, 45.20 48.39, 44.61 51.43 C 44.20 53.52, 43.79 55.62, 43.39 57.71 C 42.80 60.75, 39.86 62.73, 36.82 62.14 C 36.82 62.14, 36.82 62.14, 36.82 62.14 C 33.78 61.55, 31.80 58.61, 32.39 55.57 C 32.80 53.48, 33.21 51.38, 33.61 49.29 Z',
    rightPath:
      'M 55.39 51.43 C 54.80 48.39, 56.78 45.45, 59.82 44.86 C 59.82 44.86, 59.82 44.86, 59.82 44.86 C 62.86 44.27, 65.80 46.25, 66.39 49.29 C 66.79 51.38, 67.20 53.48, 67.61 55.57 C 68.20 58.61, 66.22 61.55, 63.18 62.14 C 63.18 62.14, 63.18 62.14, 63.18 62.14 C 60.14 62.73, 57.20 60.75, 56.61 57.71 C 56.21 55.62, 55.80 53.52, 55.39 51.43 Z',
  },
  confused: {
    leftPath:
      'M 29.30 51.50 C 29.30 46.97, 32.97 43.30, 37.50 43.30 C 37.50 43.30, 37.50 43.30, 37.50 43.30 C 42.03 43.30, 45.70 46.97, 45.70 51.50 C 45.70 51.50, 45.70 51.50, 45.70 51.50 C 45.70 56.03, 42.03 59.70, 37.50 59.70 C 37.50 59.70, 37.50 59.70, 37.50 59.70 C 32.97 59.70, 29.30 56.03, 29.30 51.50 C 29.30 51.50, 29.30 51.50, 29.30 51.50 Z',
    rightPath:
      'M 57.40 53.50 C 57.40 50.68, 59.68 48.40, 62.50 48.40 C 62.50 48.40, 62.50 48.40, 62.50 48.40 C 65.32 48.40, 67.60 50.68, 67.60 53.50 C 67.60 53.50, 67.60 53.50, 67.60 53.50 C 67.60 56.32, 65.32 58.60, 62.50 58.60 C 62.50 58.60, 62.50 58.60, 62.50 58.60 C 59.68 58.60, 57.40 56.32, 57.40 53.50 C 57.40 53.50, 57.40 53.50, 57.40 53.50 Z',
  },
  surprised: {
    leftPath:
      'M 31.90 45.00 C 31.90 41.35, 34.85 38.40, 38.50 38.40 C 38.50 38.40, 38.50 38.40, 38.50 38.40 C 42.15 38.40, 45.10 41.35, 45.10 45.00 C 45.10 49.33, 45.10 53.67, 45.10 58.00 C 45.10 61.65, 42.15 64.60, 38.50 64.60 C 38.50 64.60, 38.50 64.60, 38.50 64.60 C 34.85 64.60, 31.90 61.65, 31.90 58.00 C 31.90 53.67, 31.90 49.33, 31.90 45.00 Z',
    rightPath:
      'M 54.90 45.00 C 54.90 41.35, 57.85 38.40, 61.50 38.40 C 61.50 38.40, 61.50 38.40, 61.50 38.40 C 65.15 38.40, 68.10 41.35, 68.10 45.00 C 68.10 49.33, 68.10 53.67, 68.10 58.00 C 68.10 61.65, 65.15 64.60, 61.50 64.60 C 61.50 64.60, 61.50 64.60, 61.50 64.60 C 57.85 64.60, 54.90 61.65, 54.90 58.00 C 54.90 53.67, 54.90 49.33, 54.90 45.00 Z',
  },
  angry: {
    leftPath:
      'M 31.58 49.98 C 32.69 47.88, 35.30 47.09, 37.39 48.20 C 39.28 49.20, 41.16 50.20, 43.04 51.21 C 45.14 52.32, 45.94 54.92, 44.82 57.02 C 44.82 57.02, 44.82 57.02, 44.82 57.02 C 43.71 59.12, 41.10 59.91, 39.01 58.80 C 37.12 57.80, 35.24 56.80, 33.36 55.79 C 31.26 54.68, 30.46 52.08, 31.58 49.98 C 31.58 49.98, 31.58 49.98, 31.58 49.98 Z',
    rightPath:
      'M 55.18 57.02 C 54.06 54.92, 54.86 52.32, 56.96 51.21 C 58.84 50.20, 60.72 49.20, 62.61 48.20 C 64.70 47.09, 67.31 47.88, 68.42 49.98 C 68.42 49.98, 68.42 49.98, 68.42 49.98 C 69.54 52.08, 68.74 54.68, 66.64 55.79 C 64.76 56.80, 62.88 57.80, 60.99 58.80 C 58.90 59.91, 56.29 59.12, 55.18 57.02 C 55.18 57.02, 55.18 57.02, 55.18 57.02 Z',
  },
  sleepy: {
    leftPath:
      'M 32.00 58.00 C 32.00 56.21, 33.46 54.75, 35.25 54.75 C 37.42 54.75, 39.58 54.75, 41.75 54.75 C 43.54 54.75, 45.00 56.21, 45.00 58.00 C 45.00 58.00, 45.00 58.00, 45.00 58.00 C 45.00 59.79, 43.54 61.25, 41.75 61.25 C 39.58 61.25, 37.42 61.25, 35.25 61.25 C 33.46 61.25, 32.00 59.79, 32.00 58.00 C 32.00 58.00, 32.00 58.00, 32.00 58.00 Z',
    rightPath:
      'M 55.00 58.00 C 55.00 56.21, 56.46 54.75, 58.25 54.75 C 60.42 54.75, 62.58 54.75, 64.75 54.75 C 66.54 54.75, 68.00 56.21, 68.00 58.00 C 68.00 58.00, 68.00 58.00, 68.00 58.00 C 68.00 59.79, 66.54 61.25, 64.75 61.25 C 62.58 61.25, 60.42 61.25, 58.25 61.25 C 56.46 61.25, 55.00 59.79, 55.00 58.00 C 55.00 58.00, 55.00 58.00, 55.00 58.00 Z',
  },
};

const EYE_GROUP_MOTION: Record<
  AvatarExpression,
  {
    animate: {
      x: number | number[];
      y: number | number[];
      scale: number | number[];
      scaleY: number | number[];
    };
    transition: Record<string, unknown>;
  }
> = {
  idle: {
    animate: {
      x: [0, 0, 6.2, 6.2, -6.2, -6.2, -3.5, -3.5, 0, 0],
      y: [0, 0, -2.2, -2.2, 1.8, 1.8, -2.4, -2.4, 0, 0],
      scale: 1,
      scaleY: 1,
    },
    transition: {
      x: {
        duration: 8.4,
        times: [0, 0.14, 0.21, 0.40, 0.47, 0.66, 0.72, 0.85, 0.92, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      y: {
        duration: 8.4,
        times: [0, 0.14, 0.21, 0.40, 0.47, 0.66, 0.72, 0.85, 0.92, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      scale: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
      scaleY: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
    },
  },
  happy: {
    animate: { x: 0, y: [0.5, -2.5, 0.5], scale: [0.98, 1.06, 0.98], scaleY: 1 },
    transition: {
      x: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
      y: { duration: 1.9, repeat: Infinity, ease: 'easeInOut' },
      scale: { duration: 1.9, repeat: Infinity, ease: 'easeInOut' },
      scaleY: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
    },
  },
  excited: {
    animate: { x: 0, y: [0, -2.8, 0.4, -1.8, 0], scale: [1, 1.1, 0.98, 1.07, 1], scaleY: 1 },
    transition: {
      x: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
      y: { duration: 1.45, repeat: Infinity, ease: 'easeInOut' },
      scale: { duration: 1.45, repeat: Infinity, ease: 'easeInOut' },
      scaleY: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
    },
  },
  wink: {
    animate: { x: [0, 2.2, 0], y: 0, scale: 1, scaleY: 1 },
    transition: {
      x: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
      y: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
      scale: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
      scaleY: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
    },
  },
  focused: {
    animate: { x: [-5.5, 5.5, -5.5], y: 0, scale: 1, scaleY: 1 },
    transition: {
      x: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
      y: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
      scale: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
      scaleY: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
    },
  },
  confused: {
    animate: {
      x: [0, 5.2, 5.2, -3.6, -3.6, 0],
      y: [0, -1.2, -1.2, 0.5, 0.5, 0],
      scale: 1,
      scaleY: 1,
    },
    transition: {
      x: {
        duration: 5.4,
        times: [0, 0.16, 0.48, 0.62, 0.86, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      y: {
        duration: 5.4,
        times: [0, 0.16, 0.48, 0.62, 0.86, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      scale: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
      scaleY: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
    },
  },
  surprised: {
    animate: { x: 0, y: [0, -2.6, -0.5, -1.6, 0], scale: [1, 1.12, 1.02, 1.07, 1], scaleY: 1 },
    transition: {
      x: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
      y: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
      scale: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
      scaleY: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
    },
  },
  angry: {
    animate: {
      x: [0, 0, -4.4, -4.4, 4.4, 4.4, 0, 0],
      y: [1.0, 1.4, 0.4, 1.2, 0.4, 1.2, 1.0, 1.0],
      scale: [1, 1.03, 1.04, 1.03, 1.04, 1.03, 1, 1],
      scaleY: 1,
    },
    transition: {
      x: {
        duration: 5.4,
        times: [0, 0.14, 0.21, 0.42, 0.50, 0.72, 0.84, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      y: {
        duration: 5.4,
        times: [0, 0.14, 0.21, 0.42, 0.50, 0.72, 0.84, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      scale: {
        duration: 5.4,
        times: [0, 0.14, 0.21, 0.42, 0.50, 0.72, 0.84, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      },
      scaleY: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
    },
  },
  sleepy: {
    animate: { x: 0, y: [0, 2.8, 0], scale: 1, scaleY: [1, 0.72, 1] },
    transition: {
      x: { duration: 0.9, ease: [0.42, 0, 0.58, 1] },
      y: { duration: 4.6, repeat: Infinity, ease: 'easeInOut' },
      scale: { duration: 0.9, ease: [0.42, 0, 0.58, 1] },
      scaleY: { duration: 4.6, repeat: Infinity, ease: 'easeInOut' },
    },
  },
  loading: {
    animate: { x: 0, y: 0, scale: 1, scaleY: 1 },
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
};

interface BlinkProfile {
  keyframes: {
    scaleY: number[];
    scaleX: number[];
    y: number[];
  };
  options: {
    duration: number;
    times: number[];
    ease: readonly [number, number, number, number];
  };
  canDouble: boolean;
}

function getBlinkProfile(expression: FacialExpression, side: 'left' | 'right'): BlinkProfile {
  if (expression === 'sleepy') {
    return {
      keyframes: {
        scaleY: [1, 0.14, 0.14, 1],
        scaleX: [1, 1.07, 1.07, 1],
        y: [0, 0.5, 0.5, 0],
      },
      options: {
        duration: 0.34,
        times: [0, 0.38, 0.56, 1],
        ease: [0.4, 0, 0.2, 1],
      },
      canDouble: false,
    };
  }

  if (expression === 'happy') {
    return {
      keyframes: {
        scaleY: [1, 0.68, 0.68, 1.06, 1],
        scaleX: [1, 1.07, 1.07, 0.98, 1],
        y: [0, -0.4, -0.4, 0, 0],
      },
      options: {
        duration: 0.21,
        times: [0, 0.34, 0.5, 0.82, 1],
        ease: [0.22, 1, 0.36, 1],
      },
      canDouble: true,
    };
  }

  if (expression === 'wink' && side === 'right') {
    return {
      keyframes: {
        scaleY: [1, 0.72, 0.72, 1.04, 1],
        scaleX: [1, 1.06, 1.06, 0.98, 1],
        y: [0, -0.3, -0.3, 0, 0],
      },
      options: {
        duration: 0.17,
        times: [0, 0.32, 0.5, 0.82, 1],
        ease: [0.22, 1, 0.36, 1],
      },
      canDouble: true,
    };
  }

  return {
    keyframes: {
      scaleY: [1, 0.08, 0.08, 1.05, 1],
      scaleX: [1, 1.1, 1.1, 0.97, 1],
      y: [0, 0.6, 0.6, -0.2, 0],
    },
    options: {
      duration: 0.17,
      times: [0, 0.32, 0.5, 0.82, 1],
      ease: [0.22, 1, 0.36, 1],
    },
    canDouble: true,
  };
}

const ANGER_MARK_PATH =
  'M -6.8 -1.9 Q -1.9 -1.9 -1.9 -6.8 M 6.8 -1.9 Q 1.9 -1.9 1.9 -6.8 M 6.8 1.9 Q 1.9 1.9 1.9 6.8 M -6.8 1.9 Q -1.9 1.9 -1.9 6.8';

const DEG_TO_RAD = Math.PI / 180;

type Mat3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number],
];

function mulMat3(a: Mat3, b: Mat3): Mat3 {
  return [
    [
      a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0],
      a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1],
      a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2],
    ],
    [
      a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0],
      a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1],
      a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2],
    ],
    [
      a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0],
      a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1],
      a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2],
    ],
  ];
}

function rotX3(rad: number): Mat3 {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return [
    [1, 0, 0],
    [0, c, -s],
    [0, s, c],
  ];
}

function rotY3(rad: number): Mat3 {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return [
    [c, 0, s],
    [0, 1, 0],
    [-s, 0, c],
  ];
}

function rotZ3(rad: number): Mat3 {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return [
    [c, -s, 0],
    [s, c, 0],
    [0, 0, 1],
  ];
}

/** Projects a 2D facial element centered at (pathCx, pathCy) onto a shape's 3D surface. */
function computeSurfaceProjection(
  profile: BotSurfaceProfile,
  lonDeg: number,
  latDeg: number,
  pathCx: number,
  pathCy: number,
  nx: number,
  ny: number,
  baseScale: number
): { transform: string; opacity: string } {
  const yaw = (profile.yaw0 + nx * profile.maxYaw) * DEG_TO_RAD;
  const pitch = (profile.pitch0 - ny * profile.maxPitch) * DEG_TO_RAD;
  const roll = profile.roll0 * DEG_TO_RAD;

  const mLocal = mulMat3(rotY3(lonDeg * DEG_TO_RAD), rotX3(-latDeg * DEG_TO_RAD));
  const mFace = mulMat3(rotY3(yaw), mulMat3(rotX3(pitch), rotZ3(roll)));
  const m = mulMat3(mFace, mLocal);

  const px = m[0][2];
  const py = m[1][2];
  const pz = m[2][2];

  const upAmount = Math.max(0, -py);
  const taperMul = Math.max(0.45, 1 - profile.topTaper * upAmount);
  const rxEff = profile.rx * taperMul;
  const ryEff = profile.ry;

  const r2 = Math.min(1, px * px + py * py);
  const curveBlend =
    (1 - profile.flatness) + profile.flatness * Math.min(1, r2 * 1.18);

  const mPlane = mulMat3(rotY3(profile.yaw0 * profile.flatness * DEG_TO_RAD), rotZ3(roll));

  const persp = (1 - curveBlend * 0.12) + curveBlend * 0.14 * Math.max(0, pz);
  const sc = baseScale * persp;

  const a = (mPlane[0][0] * (1 - curveBlend) + m[0][0] * curveBlend) * sc;
  const b = (mPlane[1][0] * (1 - curveBlend) + m[1][0] * curveBlend) * sc;
  const c = (mPlane[0][1] * (1 - curveBlend) + m[0][1] * curveBlend) * sc;
  const d = (mPlane[1][1] * (1 - curveBlend) + m[1][1] * curveBlend) * sc;

  const sx = profile.centerX + rxEff * px;
  const sy = profile.centerY + ryEff * py;
  const tx = sx - (a * pathCx + c * pathCy);
  const ty = sy - (b * pathCx + d * pathCy);
  const opacity = Math.max(0, Math.min(1, (pz + 0.08) / 0.18));

  return {
    transform: `matrix(${a.toFixed(4)} ${b.toFixed(4)} ${c.toFixed(4)} ${d.toFixed(4)} ${tx.toFixed(3)} ${ty.toFixed(3)})`,
    opacity: opacity.toFixed(3),
  };
}

export interface BotAvatarProps {
  expression?: AvatarExpression;
  shape?: BotAvatarShape;
  bodyColor?: string;
  eyeColor?: string;
  size?: number;
  interactive?: boolean;
  interactivePadding?: number;
  tightHitbox?: boolean;
  trackGaze?: boolean;
  enableVibration?: boolean;
  onHaptic?: (pattern: number | number[]) => void;
  onTap?: () => void;
  ariaLabel?: string;
  className?: string;
  buttonClassName?: string;
}

export const BotAvatar: React.FC<BotAvatarProps> = ({
  expression = 'idle',
  shape = DEFAULT_BOT_SHAPE,
  bodyColor = DEFAULT_BOT_BODY_COLOR,
  eyeColor = BOT_EYE_COLOR,
  size = 180,
  interactive = true,
  interactivePadding = 16,
  tightHitbox = false,
  trackGaze = true,
  enableVibration = true,
  onHaptic,
  onTap,
  ariaLabel = 'Interactive bot avatar',
  className = '',
  buttonClassName = '',
}) => {
  const emitHaptic = (pattern: number | number[]) => {
    if (onHaptic) {
      onHaptic(pattern);
      return;
    }
    if (!enableVibration) return;
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {}
  };
  const shapeDef =
    BOT_AVATAR_SHAPES.find((item) => item.id === shape) ?? BOT_AVATAR_SHAPES[0];
  const eyeScale = shapeDef.eyeScale ?? 1;
  const eyeTilt = shapeDef.eyeTilt ?? 0;
  const eyeTransform = `translate(${50 + shapeDef.eyeOffset.x} ${51 + shapeDef.eyeOffset.y}) rotate(${eyeTilt}) scale(${eyeScale}) translate(-50 -51)`;
  const uid = useId().replace(/:/g, '');
  const clipId = `bot-shape-clip-${uid}`;

  const shouldReduceMotion = useReducedMotion();
  const tapWrapRef = useRef<HTMLDivElement>(null);
  const eyesReactRef = useRef<SVGGElement>(null);
  const leftSphereRef = useRef<SVGGElement>(null);
  const rightSphereRef = useRef<SVGGElement>(null);
  const angerSphereRef = useRef<SVGGElement>(null);
  const angerMarkRef = useRef<SVGGElement>(null);
  const leftBlinkRef = useRef<SVGGElement>(null);
  const rightBlinkRef = useRef<SVGGElement>(null);
  const bodyAnimRef = useRef<AnimationPlaybackControls | null>(null);
  const eyesAnimRef = useRef<AnimationPlaybackControls | null>(null);
  const angerAnimRef = useRef<AnimationPlaybackControls | null>(null);
  const blinkControlsRef = useRef<AnimationPlaybackControls[]>([]);
  const nodControlsRef = useRef<AnimationPlaybackControls[]>([]);
  const isNoddingRef = useRef(false);
  const isStartledRef = useRef(false);
  const nodDirRef = useRef(1);
  const startleTimerRef = useRef<number | null>(null);
  const annoyedTimerRef = useRef<number | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const petReleaseTimerRef = useRef<number | null>(null);
  const tapTimestampsRef = useRef<number[]>([]);
  const holdOriginRef = useRef<{ x: number; y: number } | null>(null);
  const isHoldingRef = useRef(false);
  const didLongPressRef = useRef(false);
  const tapDirRef = useRef(1);

  const [isStartled, setIsStartled] = useState(false);
  const [isNodWaking, setIsNodWaking] = useState(false);
  const [isAnnoyed, setIsAnnoyed] = useState(false);
  const [isPetted, setIsPetted] = useState(false);
  const [prevExpression, setPrevExpression] = useState(expression);

  const gazeRawNormX = useMotionValue(0);
  const gazeRawNormY = useMotionValue(0);
  const idleSphereX = useMotionValue(0);
  const idleSphereY = useMotionValue(0);
  const gazeRawBodyX = useMotionValue(0);
  const gazeRawBodyY = useMotionValue(0);
  const gazeRawBodyRotate = useMotionValue(0);

  const sphereNormX = useSpring(gazeRawNormX, { stiffness: 210, damping: 24 });
  const sphereNormY = useSpring(gazeRawNormY, { stiffness: 210, damping: 24 });
  const bodyGazeX = useSpring(gazeRawBodyX, { stiffness: 120, damping: 20 });
  const bodyGazeY = useSpring(gazeRawBodyY, { stiffness: 120, damping: 20 });
  const bodyGazeRotate = useSpring(gazeRawBodyRotate, { stiffness: 120, damping: 20 });

  if (expression !== prevExpression) {
    setPrevExpression(expression);
    if (isStartled) {
      setIsStartled(false);
    }
    if (isNodWaking) {
      setIsNodWaking(false);
    }
    if (isAnnoyed) {
      setIsAnnoyed(false);
    }
    if (isPetted) {
      setIsPetted(false);
    }
  }

  useEffect(() => {
    isStartledRef.current = isStartled && expression === 'sleepy';
  }, [isStartled, expression]);

  useEffect(() => {
    if (expression !== 'sleepy' && startleTimerRef.current !== null) {
      window.clearTimeout(startleTimerRef.current);
      startleTimerRef.current = null;
    }
    tapTimestampsRef.current = [];
  }, [expression]);

  useEffect(() => {
    return () => {
      if (startleTimerRef.current !== null) {
        window.clearTimeout(startleTimerRef.current);
      }
      if (annoyedTimerRef.current !== null) {
        window.clearTimeout(annoyedTimerRef.current);
      }
      if (holdTimerRef.current !== null) {
        window.clearTimeout(holdTimerRef.current);
      }
      if (petReleaseTimerRef.current !== null) {
        window.clearTimeout(petReleaseTimerRef.current);
      }
      bodyAnimRef.current?.stop();
      eyesAnimRef.current?.stop();
      angerAnimRef.current?.stop();
    };
  }, []);

  const bodyExpression: AvatarExpression =
    expression === 'loading'
      ? 'loading'
      : isPetted
        ? 'happy'
        : isAnnoyed
          ? 'angry'
          : isStartled && expression === 'sleepy'
            ? 'surprised'
            : expression;

  const effectiveExpression: AvatarExpression =
    expression === 'loading'
      ? 'loading'
      : isPetted
        ? 'happy'
        : isAnnoyed
          ? 'angry'
          : expression === 'sleepy'
            ? isStartled
              ? 'surprised'
              : isNodWaking
                ? 'idle'
                : 'sleepy'
            : expression;

  useEffect(() => {
    const resetGaze = () => {
      gazeRawNormX.set(0);
      gazeRawNormY.set(0);
      gazeRawBodyX.set(0);
      gazeRawBodyY.set(0);
      gazeRawBodyRotate.set(0);
    };

    if (
      !interactive ||
      !trackGaze ||
      shouldReduceMotion ||
      effectiveExpression === 'loading' ||
      effectiveExpression === 'sleepy'
    ) {
      resetGaze();
      return;
    }

    let idleResetTimer: number | null = null;
    const proximityRadius = Math.max(size * 0.85, 130);

    const scheduleReset = () => {
      if (idleResetTimer !== null) {
        window.clearTimeout(idleResetTimer);
      }
      idleResetTimer = window.setTimeout(() => {
        idleResetTimer = null;
        resetGaze();
      }, 1500);
    };

    const handleGlobalPointerMove = (e: PointerEvent) => {
      const wrapEl = tapWrapRef.current;
      if (!wrapEl) return;
      const rect = wrapEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist > proximityRadius) {
        if (idleResetTimer !== null) {
          window.clearTimeout(idleResetTimer);
          idleResetTimer = null;
        }
        resetGaze();
        return;
      }

      const nx = dx / proximityRadius;
      const ny = dy / proximityRadius;

      gazeRawNormX.set(nx);
      gazeRawNormY.set(ny);
      gazeRawBodyX.set(nx * 2.4);
      gazeRawBodyY.set(ny * 1.7);
      gazeRawBodyRotate.set(nx * 2.4);

      scheduleReset();
    };

    const handleTouchEnd = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        scheduleReset();
      }
    };

    window.addEventListener('pointerdown', handleGlobalPointerMove, { passive: true });
    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });
    window.addEventListener('pointerup', handleTouchEnd, { passive: true });
    window.addEventListener('pointercancel', handleTouchEnd, { passive: true });
    document.addEventListener('mouseleave', resetGaze);
    window.addEventListener('blur', resetGaze);

    return () => {
      if (idleResetTimer !== null) {
        window.clearTimeout(idleResetTimer);
      }
      window.removeEventListener('pointerdown', handleGlobalPointerMove);
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleTouchEnd);
      window.removeEventListener('pointercancel', handleTouchEnd);
      document.removeEventListener('mouseleave', resetGaze);
      window.removeEventListener('blur', resetGaze);
      resetGaze();
    };
  }, [
    interactive,
    trackGaze,
    shouldReduceMotion,
    effectiveExpression,
    size,
    gazeRawNormX,
    gazeRawNormY,
    gazeRawBodyX,
    gazeRawBodyY,
    gazeRawBodyRotate,
  ]);

  useEffect(() => {
    if (shouldReduceMotion) {
      idleSphereX.set(0);
      idleSphereY.set(0);
      return;
    }

    const motionSpec = EYE_GROUP_MOTION[effectiveExpression];
    const tx = motionSpec.transition.x as Record<string, unknown> | undefined;
    const ty = motionSpec.transition.y as Record<string, unknown> | undefined;

    const ctrlX = animate(idleSphereX, motionSpec.animate.x as number | number[], (tx ?? motionSpec.transition) as never);
    const ctrlY = animate(idleSphereY, motionSpec.animate.y as number | number[], (ty ?? motionSpec.transition) as never);

    return () => {
      ctrlX.stop();
      ctrlY.stop();
    };
  }, [effectiveExpression, shouldReduceMotion, idleSphereX, idleSphereY]);

  useEffect(() => {
    const surface = shapeDef.surface;

    const applySurface = () => {
      const gx = shouldReduceMotion ? 0 : sphereNormX.get();
      const gy = shouldReduceMotion ? 0 : sphereNormY.get();
      const ix = shouldReduceMotion ? 0 : idleSphereX.get();
      const iy = shouldReduceMotion ? 0 : idleSphereY.get();

      const nx = Math.max(-1, Math.min(1, gx + ix / 13.5));
      const ny = Math.max(-1, Math.min(1, gy + iy / 11));

      const leftProj = computeSurfaceProjection(
        surface,
        -surface.eyeLonDeg,
        surface.eyeLatDeg,
        38.5,
        53,
        nx,
        ny,
        eyeScale
      );
      const rightProj = computeSurfaceProjection(
        surface,
        surface.eyeLonDeg,
        surface.eyeLatDeg,
        61.5,
        53,
        nx,
        ny,
        eyeScale
      );
      const angerProj = computeSurfaceProjection(
        surface,
        surface.eyeLonDeg + 13,
        surface.eyeLatDeg + 14,
        0,
        0,
        nx,
        ny,
        eyeScale
      );
      if (leftSphereRef.current) {
        leftSphereRef.current.setAttribute('transform', leftProj.transform);
        leftSphereRef.current.setAttribute('opacity', leftProj.opacity);
      }
      if (rightSphereRef.current) {
        rightSphereRef.current.setAttribute('transform', rightProj.transform);
        rightSphereRef.current.setAttribute('opacity', rightProj.opacity);
      }
      if (angerSphereRef.current) {
        angerSphereRef.current.setAttribute('transform', angerProj.transform);
        angerSphereRef.current.setAttribute('opacity', angerProj.opacity);
      }
    };

    applySurface();
    const unsubs = [
      sphereNormX.on('change', applySurface),
      sphereNormY.on('change', applySurface),
      idleSphereX.on('change', applySurface),
      idleSphereY.on('change', applySurface),
    ];

    return () => {
      for (const unsub of unsubs) {
        unsub();
      }
    };
  }, [
    shapeDef,
    shouldReduceMotion,
    eyeScale,
    effectiveExpression,
    sphereNormX,
    sphereNormY,
    idleSphereX,
    idleSphereY,
  ]);

  useEffect(() => {
    const leftEl = leftBlinkRef.current;
    const rightEl = rightBlinkRef.current;

    for (const control of blinkControlsRef.current) {
      control.stop();
    }
    blinkControlsRef.current = [];

    const resetEye = (el: SVGGElement | null) => {
      if (!el || !el.isConnected) return;
      animate(el, { scaleX: 1, scaleY: 1, y: 0 }, { duration: 0.08 });
    };

    if (shouldReduceMotion || effectiveExpression === 'loading') {
      resetEye(leftEl);
      resetEye(rightEl);
      return;
    }

    let cancelled = false;
    let mainTimer: number | null = null;
    let secondBlinkTimer: number | null = null;

    const triggerSingleBlink = () => {
      if (cancelled || isNoddingRef.current) return;
      for (const control of blinkControlsRef.current) {
        control.stop();
      }
      blinkControlsRef.current = [];

      const targets: Array<{ side: 'left' | 'right'; el: SVGGElement | null }> = [
        { side: 'left', el: leftEl },
        { side: 'right', el: rightEl },
      ];

      for (const { side, el } of targets) {
        if (!el) continue;
        const profile = getBlinkProfile(effectiveExpression, side);
        blinkControlsRef.current.push(animate(el, profile.keyframes, profile.options));
      }
    };

    const scheduleNext = (isFirst: boolean) => {
      if (cancelled) return;
      const isSleepy = effectiveExpression === 'sleepy';
      const delayMs = isFirst
        ? isSleepy
          ? 1250 + Math.random() * 900
          : 700 + Math.random() * 650
        : isSleepy
          ? 2400 + Math.random() * 1900
          : 1900 + Math.random() * 2300;

      mainTimer = window.setTimeout(() => {
        if (cancelled) return;
        triggerSingleBlink();

        const leftProfile = getBlinkProfile(effectiveExpression, 'left');
        const shouldDoubleBlink = leftProfile.canDouble && Math.random() < 0.28;

        if (shouldDoubleBlink) {
          const secondDelayMs = Math.round(leftProfile.options.duration * 1000) + 90;
          secondBlinkTimer = window.setTimeout(() => {
            if (cancelled) return;
            triggerSingleBlink();
            scheduleNext(false);
          }, secondDelayMs);
        } else {
          scheduleNext(false);
        }
      }, delayMs);
    };

    scheduleNext(true);

    return () => {
      cancelled = true;
      if (mainTimer !== null) {
        window.clearTimeout(mainTimer);
      }
      if (secondBlinkTimer !== null) {
        window.clearTimeout(secondBlinkTimer);
      }
      for (const control of blinkControlsRef.current) {
        control.stop();
      }
      blinkControlsRef.current = [];
      resetEye(leftEl);
      resetEye(rightEl);
    };
  }, [effectiveExpression, shouldReduceMotion, shapeDef.id]);

  useEffect(() => {
    const wrapEl = tapWrapRef.current;
    const eyesEl = eyesReactRef.current;
    const leftEl = leftBlinkRef.current;
    const rightEl = rightBlinkRef.current;

    const stopNodAnimations = () => {
      for (const control of nodControlsRef.current) {
        control.stop();
      }
      nodControlsRef.current = [];
    };

    const resetNodTransforms = () => {
      if (wrapEl && wrapEl.isConnected) {
        animate(wrapEl, { y: 0, rotate: 0, scaleX: 1, scaleY: 1 }, { duration: 0.28 });
      }
      if (eyesEl && eyesEl.isConnected) {
        animate(eyesEl, { y: 0 }, { duration: 0.24 });
      }
      if (leftEl && leftEl.isConnected) {
        animate(leftEl, { scaleX: 1, scaleY: 1, y: 0 }, { duration: 0.16 });
      }
      if (rightEl && rightEl.isConnected) {
        animate(rightEl, { scaleX: 1, scaleY: 1, y: 0 }, { duration: 0.16 });
      }
    };

    if (expression !== 'sleepy' || isStartled || isAnnoyed || isPetted || shouldReduceMotion) {
      isNoddingRef.current = false;
      stopNodAnimations();
      return;
    }

    let cancelled = false;
    const timers: number[] = [];

    const after = (ms: number, fn: () => void) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(id);
    };

    const runEpisode = () => {
      if (cancelled) return;
      isNoddingRef.current = true;
      stopNodAnimations();

      nodDirRef.current *= -1;
      const dir = nodDirRef.current;
      const snoozeHoldMs = 1350 + Math.random() * 1050;

      // 1. Ațipire lentă (capul și ochii coboară greu, pleoapele se închid)
      if (wrapEl) {
        nodControlsRef.current.push(
          animate(
            wrapEl,
            {
              y: [0, 5.5, 7.2],
              rotate: [0, 3.8 * dir, 5.0 * dir],
              scaleX: [1, 1.03, 1.045],
              scaleY: [1, 0.955, 0.94],
            },
            { duration: 1.05, times: [0, 0.55, 1], ease: [0.4, 0, 0.2, 1] }
          )
        );
      }

      if (eyesEl) {
        nodControlsRef.current.push(
          animate(eyesEl, { y: [0, 3.2] }, { duration: 1.0, ease: [0.4, 0, 0.2, 1] })
        );
      }

      for (const eyeEl of [leftEl, rightEl]) {
        if (!eyeEl) continue;
        nodControlsRef.current.push(
          animate(
            eyeEl,
            { scaleY: [1, 0.12], scaleX: [1, 1.08], y: [0, 0.6] },
            { duration: 0.85, ease: [0.4, 0, 0.2, 1] }
          )
        );
      }

      // 2. Tresărire scurtă după ațipire
      after(1050 + snoozeHoldMs, () => {
        stopNodAnimations();
        setIsNodWaking(true);

        if (wrapEl) {
          nodControlsRef.current.push(
            animate(
              wrapEl,
              {
                y: [7.2, -7.0, 1.2, -1.8, 0],
                rotate: [5.0 * dir, -3.2 * dir, 1.2 * dir, -0.4 * dir, 0],
                scaleX: [1.045, 0.95, 1.02, 0.99, 1],
                scaleY: [0.94, 1.06, 0.985, 1.01, 1],
              },
              { duration: 0.54, times: [0, 0.26, 0.56, 0.8, 1], ease: [0.22, 1, 0.36, 1] }
            )
          );
        }

        if (eyesEl) {
          nodControlsRef.current.push(
            animate(
              eyesEl,
              { y: [3.2, -3.2, 0] },
              { duration: 0.44, times: [0, 0.38, 1], ease: [0.22, 1, 0.36, 1] }
            )
          );
        }

        for (const eyeEl of [leftEl, rightEl]) {
          if (!eyeEl) continue;
          nodControlsRef.current.push(
            animate(
              eyeEl,
              { scaleY: [0.12, 1.08, 1], scaleX: [1.08, 0.97, 1], y: [0.6, 0, 0] },
              { duration: 0.24, times: [0, 0.6, 1], ease: [0.22, 1, 0.36, 1] }
            )
          );
        }

        // 3. Revine lent și natural în starea de sleepy după tresărire
        after(780, () => {
          setIsNodWaking(false);
          if (wrapEl && wrapEl.isConnected) {
            nodControlsRef.current.push(
              animate(
                wrapEl,
                { y: [0, 2.2, 0], scaleY: [1, 0.985, 1] },
                { duration: 0.95, ease: [0.42, 0, 0.58, 1] }
              )
            );
          }
          after(950, () => {
            isNoddingRef.current = false;
            scheduleEpisode(false);
          });
        });
      });
    };

    const scheduleEpisode = (isFirst: boolean) => {
      const waitMs = isFirst
        ? 2600 + Math.random() * 2200
        : 5500 + Math.random() * 8500;
      after(waitMs, runEpisode);
    };

    scheduleEpisode(true);

    return () => {
      cancelled = true;
      for (const id of timers) {
        window.clearTimeout(id);
      }
      isNoddingRef.current = false;
      stopNodAnimations();
      if (!isStartledRef.current && !isAnnoyed && !isPetted) {
        resetNodTransforms();
      }
    };
  }, [expression, isStartled, isAnnoyed, isPetted, shouldReduceMotion, shapeDef.id]);

  const triggerGrumpyReaction = () => {
    if (shouldReduceMotion) return;

    tapDirRef.current *= -1;
    const dir = tapDirRef.current;

    bodyAnimRef.current?.stop();
    eyesAnimRef.current?.stop();
    angerAnimRef.current?.stop();

    if (tapWrapRef.current) {
      bodyAnimRef.current = animate(
        tapWrapRef.current,
        {
          x: [0, -6 * dir, 6 * dir, -3 * dir, 0],
          y: [0, 3, -1, 2, 0],
          scaleX: [1, 1.06, 0.98, 1.03, 1],
          scaleY: [1, 0.92, 1.02, 0.96, 1],
          rotate: [0, -4 * dir, 4 * dir, -2 * dir, 0],
        },
        {
          duration: 0.44,
          times: [0, 0.22, 0.48, 0.72, 1],
          ease: [0.22, 1, 0.36, 1],
        }
      );
    }

    if (eyesReactRef.current) {
      eyesAnimRef.current = animate(
        eyesReactRef.current,
        {
          y: [0, 1.6, -0.3, 0],
          scaleY: [1, 0.56, 1.04, 1],
          scaleX: [1, 1.07, 0.99, 1],
        },
        {
          duration: 0.38,
          times: [0, 0.35, 0.78, 1],
          ease: [0.22, 1, 0.36, 1],
        }
      );
    }

    if (angerMarkRef.current) {
      angerAnimRef.current = animate(
        angerMarkRef.current,
        {
          scale: [1, 1.42, 0.9, 1.16, 1],
          rotate: [0, 12, -8, 6, 0],
        },
        {
          duration: 0.44,
          times: [0, 0.25, 0.55, 0.8, 1],
          ease: [0.22, 1, 0.36, 1],
        }
      );
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!interactive || expression === 'loading') return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    didLongPressRef.current = false;
    holdOriginRef.current = { x: e.clientX, y: e.clientY };

    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
    }
    if (petReleaseTimerRef.current !== null) {
      window.clearTimeout(petReleaseTimerRef.current);
      petReleaseTimerRef.current = null;
    }

    holdTimerRef.current = window.setTimeout(() => {
      holdTimerRef.current = null;
      didLongPressRef.current = true;
      isHoldingRef.current = true;
      tapTimestampsRef.current = [];

      if (annoyedTimerRef.current !== null) {
        window.clearTimeout(annoyedTimerRef.current);
        annoyedTimerRef.current = null;
      }
      if (startleTimerRef.current !== null) {
        window.clearTimeout(startleTimerRef.current);
        startleTimerRef.current = null;
      }

      isNoddingRef.current = false;
      isStartledRef.current = false;
      setIsAnnoyed(false);
      setIsStartled(false);
      setIsNodWaking(false);
      setIsPetted(true);
      emitHaptic([8, 25, 10]);

      if (!shouldReduceMotion && tapWrapRef.current) {
        bodyAnimRef.current?.stop();
        bodyAnimRef.current = animate(
          tapWrapRef.current,
          {
            y: [0, -6, 0],
            scaleX: [1, 1.06, 0.97, 1],
            scaleY: [1, 0.95, 1.04, 1],
          },
          { duration: 0.42, times: [0, 0.35, 0.72, 1], ease: [0.22, 1, 0.36, 1] }
        );
      }
    }, 420);
  };

  const handlePointerMoveButton = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (holdTimerRef.current === null || !holdOriginRef.current) return;
    const dx = e.clientX - holdOriginRef.current.x;
    const dy = e.clientY - holdOriginRef.current.y;
    if (Math.hypot(dx, dy) > 16) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const handlePointerRelease = () => {
    holdOriginRef.current = null;
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      if (petReleaseTimerRef.current !== null) {
        window.clearTimeout(petReleaseTimerRef.current);
      }
      petReleaseTimerRef.current = window.setTimeout(() => {
        petReleaseTimerRef.current = null;
        setIsPetted(false);
      }, 1050);
    }
  };

  const handleAvatarTap = () => {
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }

    onTap?.();
    if (!interactive) return;

    const now = Date.now();
    if (expression !== 'loading' && expression !== 'angry') {
      const recent = tapTimestampsRef.current.filter((ts) => now - ts < 1400);
      recent.push(now);
      tapTimestampsRef.current = recent;

      if (recent.length >= 4 && !isAnnoyed) {
        tapTimestampsRef.current = [];
        if (annoyedTimerRef.current !== null) {
          window.clearTimeout(annoyedTimerRef.current);
        }
        if (startleTimerRef.current !== null) {
          window.clearTimeout(startleTimerRef.current);
          startleTimerRef.current = null;
        }
        isNoddingRef.current = false;
        isStartledRef.current = false;
        setIsStartled(false);
        setIsNodWaking(false);
        setIsPetted(false);
        setIsAnnoyed(true);
        emitHaptic([14, 30, 14]);
        triggerGrumpyReaction();

        annoyedTimerRef.current = window.setTimeout(() => {
          annoyedTimerRef.current = null;
          setIsAnnoyed(false);
        }, 2200);
        return;
      }
    }

    if (expression === 'sleepy' && !isAnnoyed) {
      emitHaptic([14, 40, 10]);

      if (startleTimerRef.current !== null) {
        window.clearTimeout(startleTimerRef.current);
      }
      isNoddingRef.current = false;
      isStartledRef.current = true;
      setIsNodWaking(false);
      setIsStartled(true);
      startleTimerRef.current = window.setTimeout(() => {
        startleTimerRef.current = null;
        isStartledRef.current = false;
        setIsStartled(false);
        if (tapWrapRef.current && tapWrapRef.current.isConnected) {
          bodyAnimRef.current?.stop();
          bodyAnimRef.current = animate(
            tapWrapRef.current,
            { y: [0, 2.5, 0], scaleY: [1, 0.98, 1] },
            { duration: 0.95, ease: [0.42, 0, 0.58, 1] }
          );
        }
      }, 1200);

      if (shouldReduceMotion) return;

      tapDirRef.current *= -1;
      const dir = tapDirRef.current;

      for (const control of nodControlsRef.current) {
        control.stop();
      }
      nodControlsRef.current = [];
      for (const eyeEl of [leftBlinkRef.current, rightBlinkRef.current]) {
        if (eyeEl) {
          animate(eyeEl, { scaleX: 1, scaleY: 1, y: 0 }, { duration: 0.08 });
        }
      }
      bodyAnimRef.current?.stop();
      eyesAnimRef.current?.stop();
      angerAnimRef.current?.stop();

      if (tapWrapRef.current) {
        bodyAnimRef.current = animate(
          tapWrapRef.current,
          {
            y: [0, -16, 2, -4, 0],
            scaleX: [1, 0.92, 1.07, 0.98, 1],
            scaleY: [1, 1.09, 0.94, 1.02, 1],
            rotate: [0, -6 * dir, 4 * dir, -1.5 * dir, 0],
          },
          {
            duration: 0.58,
            times: [0, 0.24, 0.54, 0.78, 1],
            ease: [0.22, 1, 0.36, 1],
          }
        );
      }

      if (eyesReactRef.current) {
        eyesAnimRef.current = animate(
          eyesReactRef.current,
          {
            y: [2, -2.5, 0],
            scaleY: [0.7, 1.15, 1],
          },
          {
            duration: 0.36,
            times: [0, 0.4, 1],
            ease: [0.22, 1, 0.36, 1],
          }
        );
      }
      return;
    }

    if (effectiveExpression === 'angry') {
      emitHaptic([12, 28, 12]);
      triggerGrumpyReaction();
      return;
    }

    emitHaptic(10);
    if (shouldReduceMotion) return;

    tapDirRef.current *= -1;
    const dir = tapDirRef.current;

    bodyAnimRef.current?.stop();
    eyesAnimRef.current?.stop();

    if (tapWrapRef.current) {
      bodyAnimRef.current = animate(
        tapWrapRef.current,
        {
          y: [0, -10, 0],
          scaleX: [1, 0.97, 1.02, 1],
          scaleY: [1, 1.04, 0.98, 1],
          rotate: [0, 3 * dir, -0.8 * dir, 0],
        },
        {
          duration: 0.48,
          times: [0, 0.35, 0.72, 1],
          ease: [0.22, 1, 0.36, 1],
        }
      );
    }

    if (eyesReactRef.current && effectiveExpression !== 'loading') {
      eyesAnimRef.current = animate(
        eyesReactRef.current,
        {
          y: [0, -1, 0],
          scaleY: [1, 0.28, 1],
        },
        {
          duration: 0.34,
          times: [0, 0.42, 1],
          ease: 'easeInOut',
        }
      );
    }
  };

  const svgContent = (
    <motion.div
      key={shapeDef.id}
      initial={shouldReduceMotion ? false : { scale: 0.94, opacity: 0.72 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: 'transform' }}
    >
      <div ref={tapWrapRef} style={{ willChange: 'transform' }}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        role="img"
        aria-hidden={interactive ? 'true' : undefined}
        aria-label={interactive ? undefined : ariaLabel}
        className={className}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          overflow: 'visible',
          display: 'block',
          pointerEvents: tightHitbox ? 'none' : undefined,
        }}
        animate={shouldReduceMotion ? undefined : BODY_IDLE_MOTION[bodyExpression].animate}
        transition={shouldReduceMotion ? undefined : BODY_IDLE_MOTION[bodyExpression].transition}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={shapeDef.path} />
          </clipPath>
        </defs>

        <motion.g
          style={{
            x: shouldReduceMotion ? 0 : bodyGazeX,
            y: shouldReduceMotion ? 0 : bodyGazeY,
            rotate: shouldReduceMotion ? 0 : bodyGazeRotate,
            transformBox: 'fill-box',
            transformOrigin: 'center',
            pointerEvents: tightHitbox && interactive ? 'auto' : undefined,
            cursor: tightHitbox && interactive ? 'pointer' : undefined,
          }}
        >
        {/* Flat tinted organic body */}
        <path
          d={shapeDef.path}
          fill={bodyColor}
          style={{ transition: shouldReduceMotion ? undefined : 'fill 200ms ease' }}
        />

        <g clipPath={`url(#${clipId})`}>
          <motion.g
            animate={
              shouldReduceMotion
                ? { x: 0, y: 0, scale: 1, scaleY: 1 }
                : {
                    x: 0,
                    y: 0,
                    scale: EYE_GROUP_MOTION[effectiveExpression].animate.scale,
                    scaleY: EYE_GROUP_MOTION[effectiveExpression].animate.scaleY,
                  }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : EYE_GROUP_MOTION[effectiveExpression].transition
            }
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <g
              ref={eyesReactRef}
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
              }}
            >
              <AnimatePresence mode="sync" initial={false}>
                {effectiveExpression !== 'loading' ? (
                  <motion.g
                    key="facial-eyes"
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.5 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
                    }
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  >
                    {(['left', 'right'] as const).map((side) => {
                      const pose = EYE_POSES[effectiveExpression];
                      const d = side === 'left' ? pose.leftPath : pose.rightPath;

                      return (
                        <g key={side} ref={side === 'left' ? leftSphereRef : rightSphereRef}>
                          <g
                            ref={side === 'left' ? leftBlinkRef : rightBlinkRef}
                            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                          >
                            <motion.path
                              d={d}
                              fill={eyeColor}
                              initial={false}
                              animate={{ d }}
                              transition={
                                shouldReduceMotion
                                  ? { duration: 0 }
                                  : effectiveExpression === 'sleepy'
                                    ? { d: { duration: 0.95, ease: [0.42, 0, 0.58, 1] } }
                                    : { d: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }
                              }
                            />
                          </g>
                        </g>
                      );
                    })}
                  </motion.g>
                ) : (
                  <motion.g
                    key="loading"
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.55 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.55 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
                    }
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  >
                    <g transform={eyeTransform}>
                      <g transform="translate(50 50)">
                        <circle
                          cx="0"
                          cy="0"
                          r="14"
                          stroke={eyeColor}
                          strokeOpacity="0.24"
                          strokeWidth="5.5"
                          fill="none"
                        />
                        <motion.circle
                          cx="0"
                          cy="0"
                          r="14"
                          stroke={eyeColor}
                          strokeWidth="5.5"
                          strokeLinecap="round"
                          strokeDasharray="34 88"
                          fill="none"
                          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                          animate={shouldReduceMotion ? undefined : { rotate: [0, 360] }}
                          transition={
                            shouldReduceMotion
                              ? undefined
                              : { duration: 0.9, repeat: Infinity, ease: 'linear' }
                          }
                        />
                      </g>
                    </g>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>

            <g ref={angerSphereRef}>
              <AnimatePresence>
                {effectiveExpression === 'angry' && (
                  <motion.g
                    key="anger-mark"
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.28, rotate: -10 }}
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1, scale: 0.72, rotate: 12 }
                        : {
                            opacity: 1,
                            scale: [0.7, 0.86, 0.66, 0.82, 0.7],
                            rotate: [10, 16, 8, 14, 10],
                          }
                    }
                    exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.28, rotate: -10 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            opacity: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                            scale: {
                              duration: 1.5,
                              times: [0, 0.25, 0.5, 0.75, 1],
                              repeat: Infinity,
                              ease: 'easeInOut',
                            },
                            rotate: {
                              duration: 1.5,
                              times: [0, 0.25, 0.5, 0.75, 1],
                              repeat: Infinity,
                              ease: 'easeInOut',
                            },
                          }
                    }
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  >
                    <g
                      ref={angerMarkRef}
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    >
                      <path
                        d={ANGER_MARK_PATH}
                        stroke={eyeColor}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </g>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          </motion.g>
        </g>
        </motion.g>
      </motion.svg>
    </div>
    </motion.div>
  );

  if (!interactive) {
    return svgContent;
  }

  return (
    <button
      type="button"
      onClick={handleAvatarTap}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMoveButton}
      onPointerUp={handlePointerRelease}
      onPointerCancel={handlePointerRelease}
      onPointerLeave={handlePointerRelease}
      className={buttonClassName || undefined}
      style={{
        padding: interactivePadding,
        borderRadius: 9999,
        border: 'none',
        background: 'transparent',
        cursor: tightHitbox ? 'default' : 'pointer',
        pointerEvents: tightHitbox ? 'none' : undefined,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        appearance: 'none',
      }}
      aria-label={ariaLabel}
    >
      <motion.div
        whileTap={shouldReduceMotion ? undefined : { scale: 0.95, y: 2 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      >
        {svgContent}
      </motion.div>
    </button>
  );
};

export default BotAvatar;
