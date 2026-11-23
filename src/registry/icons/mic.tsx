"use client";

import {
  getVariants,
  type IconProps,
  IconWrapper,
  useAnimateIconContext,
} from "@animate-ui/react/icons";
import { motion, type Variants } from "motion/react";

type MicProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    capsule: {
      initial: { y: 0, scaleY: 1 },
      animate: {
        y: [0, -1.5, 0],
        scaleY: [1, 1.06, 1],
        transition: { duration: 0.42, ease: "easeInOut" },
      },
    },
    stand: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.03, 1],
        transition: { duration: 0.42, ease: "easeInOut" },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: MicProps) {
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
      <motion.path
        d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
        style={{ transformOrigin: "12px 11px" }}
        variants={variants.capsule}
        initial="initial"
        animate={controls}
      />
      <motion.g
        style={{ transformOrigin: "12px 17px" }}
        variants={variants.stand}
        initial="initial"
        animate={controls}
      >
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </motion.g>
    </motion.svg>
  );
}

function Mic(props: MicProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Mic,
  Mic as MicIcon,
  type MicProps,
  type MicProps as MicIconProps,
};
