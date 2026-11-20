'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type GripVerticalProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    col1: {
      initial: { y: 0 },
      animate: {
        y: [0, -1.2, 0],
        transition: { duration: 0.35, ease: 'easeInOut' },
      },
    },
    col2: {
      initial: { y: 0 },
      animate: {
        y: [0, 1.2, 0],
        transition: { duration: 0.35, ease: 'easeInOut', delay: 0.05 },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: GripVerticalProps) {
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
      <motion.g variants={variants.col1} initial="initial" animate={controls}>
        <circle cx="9" cy="12" r="1" />
        <circle cx="9" cy="5" r="1" />
        <circle cx="9" cy="19" r="1" />
      </motion.g>
      <motion.g variants={variants.col2} initial="initial" animate={controls}>
        <circle cx="15" cy="12" r="1" />
        <circle cx="15" cy="5" r="1" />
        <circle cx="15" cy="19" r="1" />
      </motion.g>
    </motion.svg>
  );
}

function GripVertical(props: GripVerticalProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  GripVertical,
  GripVertical as GripVerticalIcon,
  type GripVerticalProps,
  type GripVerticalProps as GripVerticalIconProps,
};
