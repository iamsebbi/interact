"use client";

import {
  getVariants,
  type IconProps,
  IconWrapper,
  useAnimateIconContext,
} from "@animate-ui/react/icons";
import { motion, type Variants } from "motion/react";

type LayoutGridProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    rect1: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 0.85, 1],
        transition: { duration: 0.35, ease: "easeInOut" },
      },
    },
    rect2: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 0.85, 1],
        transition: { duration: 0.35, ease: "easeInOut", delay: 0.06 },
      },
    },
    rect3: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 0.85, 1],
        transition: { duration: 0.35, ease: "easeInOut", delay: 0.12 },
      },
    },
    rect4: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 0.85, 1],
        transition: { duration: 0.35, ease: "easeInOut", delay: 0.18 },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: LayoutGridProps) {
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
      <motion.rect
        width="7"
        height="7"
        x="3"
        y="3"
        rx="1"
        variants={variants.rect1}
        initial="initial"
        animate={controls}
        style={{ transformOrigin: "6.5px 6.5px" }}
      />
      <motion.rect
        width="7"
        height="7"
        x="14"
        y="3"
        rx="1"
        variants={variants.rect2}
        initial="initial"
        animate={controls}
        style={{ transformOrigin: "17.5px 6.5px" }}
      />
      <motion.rect
        width="7"
        height="7"
        x="14"
        y="14"
        rx="1"
        variants={variants.rect3}
        initial="initial"
        animate={controls}
        style={{ transformOrigin: "17.5px 17.5px" }}
      />
      <motion.rect
        width="7"
        height="7"
        x="3"
        y="14"
        rx="1"
        variants={variants.rect4}
        initial="initial"
        animate={controls}
        style={{ transformOrigin: "6.5px 17.5px" }}
      />
    </motion.svg>
  );
}

function LayoutGrid(props: LayoutGridProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  LayoutGrid,
  LayoutGrid as LayoutGridIcon,
  type LayoutGridProps,
  type LayoutGridProps as LayoutGridIconProps,
};
