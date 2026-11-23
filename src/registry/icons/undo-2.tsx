"use client";

import {
  getVariants,
  type IconProps,
  IconWrapper,
  useAnimateIconContext,
} from "@animate-ui/react/icons";
import { motion, type Variants } from "motion/react";

type Undo2Props = IconProps<keyof typeof animations>;

const drawVariants = {
  path1: {
    initial: { pathLength: 1, opacity: 1 },
    animate: {
      pathLength: [0, 1],
      opacity: [0, 1],
      transition: { duration: 0.22, delay: 0.22, ease: "easeOut" },
    },
  },
  path2: {
    initial: { pathLength: 1, opacity: 1 },
    animate: {
      pathLength: [0, 1],
      opacity: [0, 1],
      transition: { duration: 0.32, ease: "easeOut" },
    },
  },
} satisfies Record<string, Variants>;

const animations = {
  default: drawVariants,
  draw: drawVariants,
} as const;

function IconComponent({ size, ...props }: Undo2Props) {
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
      initial="initial"
      animate={controls}
      {...props}
    >
      <motion.path
        d="M9 14 4 9l5-5"
        variants={variants.path1}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M11 20h3.5a5.5 5.5 0 0 0 0-11H4"
        variants={variants.path2}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Undo2(props: Undo2Props) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Undo2,
  Undo2 as Undo2Icon,
  type Undo2Props,
  type Undo2Props as Undo2IconProps,
};
