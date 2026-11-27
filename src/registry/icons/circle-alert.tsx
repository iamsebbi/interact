"use client";

import {
  getVariants,
  type IconProps,
  IconWrapper,
  useAnimateIconContext,
} from "@animate-ui/react/icons";
import { motion, type Variants } from "motion/react";

type CircleAlertProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    circle: {},
    line: {
      initial: { y: 0 },
      animate: {
        y: [0, -1.5, 0],
        transition: { duration: 0.4, ease: "easeInOut" },
      },
    },
    dot: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.3, 1],
        transition: { duration: 0.4, ease: "easeInOut" },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: CircleAlertProps) {
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
      />
      <motion.line
        x1="12"
        x2="12"
        y1="8"
        y2="12"
        variants={variants.line}
        initial="initial"
        animate={controls}
      />
      <motion.line
        x1="12"
        x2="12.01"
        y1="16"
        y2="16"
        variants={variants.dot}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function CircleAlert(props: CircleAlertProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  CircleAlert,
  CircleAlert as CircleAlertIcon,
  type CircleAlertProps,
  type CircleAlertProps as CircleAlertIconProps,
};
