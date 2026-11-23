"use client";

import {
  getVariants,
  type IconProps,
  IconWrapper,
  useAnimateIconContext,
} from "@animate-ui/react/icons";
import { motion, type Variants } from "motion/react";

type PauseProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    rect1: {
      initial: {
        scaleY: 1,
        transition: { duration: 0.25, ease: "easeInOut" },
      },
      animate: {
        scaleY: [1, 0.78, 1],
        transition: { duration: 0.35, ease: "easeInOut" },
      },
    },
    rect2: {
      initial: {
        scaleY: 1,
        transition: { duration: 0.25, ease: "easeInOut" },
      },
      animate: {
        scaleY: [1, 0.78, 1],
        transition: { duration: 0.35, delay: 0.08, ease: "easeInOut" },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: PauseProps) {
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
        x="14"
        y="3"
        width="5"
        height="18"
        rx="1"
        style={{ transformOrigin: "16.5px 12px" }}
        variants={variants.rect2}
        initial="initial"
        animate={controls}
      />
      <motion.rect
        x="5"
        y="3"
        width="5"
        height="18"
        rx="1"
        style={{ transformOrigin: "7.5px 12px" }}
        variants={variants.rect1}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Pause(props: PauseProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Pause,
  Pause as PauseIcon,
  type PauseProps,
  type PauseProps as PauseIconProps,
};
