"use client";

import {
  getVariants,
  type IconProps,
  IconWrapper,
  useAnimateIconContext,
} from "@animate-ui/react/icons";
import { motion, type Variants } from "motion/react";

type SquareProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    rect: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 0.86, 1],
        transition: { duration: 0.32, ease: "easeInOut" },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: SquareProps) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <motion.rect
        x="4.5"
        y="4.5"
        width="15"
        height="15"
        rx="3.2"
        style={{ transformOrigin: "12px 12px" }}
        variants={variants.rect}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Square(props: SquareProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Square,
  Square as SquareIcon,
  type SquareProps,
  type SquareProps as SquareIconProps,
};
