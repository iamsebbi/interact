"use client";

import {
  getVariants,
  type IconProps,
  IconWrapper,
  useAnimateIconContext,
} from "@animate-ui/react/icons";
import { motion, type Variants } from "motion/react";

type LockProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    rect: {},
    shackle: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: { duration: 0.4, ease: "easeInOut" },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: LockProps) {
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
        width="18"
        height="11"
        x="3"
        y="11"
        rx="2"
        ry="2"
        variants={variants.rect}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M7 11V7a5 5 0 0 1 10 0v4"
        variants={variants.shackle}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Lock(props: LockProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Lock,
  Lock as LockIcon,
  type LockProps,
  type LockProps as LockIconProps,
};
