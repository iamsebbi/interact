import React from "react";

export interface AsteriskSymbolProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export function AsteriskSymbol({
  size = 18,
  className,
  ...props
}: AsteriskSymbolProps) {
  return (
    <svg
      viewBox="0 0 84 80"
      width={size}
      height={size}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M 32.5 0.0 L 32.4 27.5 L 7.7 17.1 L 0.0 34.3 L 25.6 45.4 L 8.4 66.1 L 24.0 79.2 L 42.0 57.9 L 60.0 79.2 L 75.6 66.1 L 58.4 45.4 L 84.0 34.3 L 76.3 17.1 L 51.6 27.5 L 51.5 0.0 Z"
        fill="currentColor"
      />
    </svg>
  );
}
