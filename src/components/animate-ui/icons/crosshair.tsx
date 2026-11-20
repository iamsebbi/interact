'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type CrosshairProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    circle: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 0.9, 1.05, 1],
        transition: { duration: 0.45, ease: 'easeInOut' },
      },
    },
    lines: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 0.85, 1],
        transition: { duration: 0.45, ease: 'easeInOut' },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: CrosshairProps) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        variants={variants.circle}
        initial="initial"
        animate={controls}
        style={{ transformOrigin: '12px 12px' }}
      />
      <motion.g
        variants={variants.lines}
        initial="initial"
        animate={controls}
        style={{ transformOrigin: '12px 12px' }}
      >
        <line x1="22" x2="18" y1="12" y2="12" />
        <line x1="6" x2="2" y1="12" y2="12" />
        <line x1="12" x2="12" y1="6" y2="2" />
        <line x1="12" x2="12" y1="22" y2="18" />
      </motion.g>
    </motion.svg>
  );
}

function Crosshair(props: CrosshairProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Crosshair,
  Crosshair as CrosshairIcon,
  type CrosshairProps,
  type CrosshairProps as CrosshairIconProps,
};
