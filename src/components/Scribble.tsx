import type { SVGProps } from "react";

type ScribbleSvgProps = {
  strokeWidth?: number;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, "className" | "strokeWidth">;

/**
 * Hand-drawn style SVG ornaments (inline, no external assets).
 * Used to create editorial "sketch" accents.
 */
export function ScribbleUnderline({
  className,
  strokeWidth = 2,
  ...props
}: ScribbleSvgProps) {
  return (
    <svg
      viewBox="0 0 240 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={className}
      {...props}
    >
      <path
        d="M6 14 C 28 6, 48 21, 68 13
           S 108 6, 130 14
           S 176 20, 196 12
           S 222 8, 234 14"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 18 C 34 12, 52 22, 74 16
           S 118 12, 140 18
           S 180 24, 204 16
           S 228 14, 234 18"
        stroke="currentColor"
        strokeWidth={Math.max(1, strokeWidth - 0.5)}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.45"
      />
    </svg>
  );
}

export function ScribbleFrame({
  className,
  strokeWidth = 2,
  ...props
}: ScribbleSvgProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={className}
      {...props}
    >
      <path
        d="M14 26 C 10 18, 18 12, 26 14
           S 42 18, 50 14
           S 68 12, 74 16
           S 90 22, 86 34
           S 88 50, 84 58
           S 82 76, 70 82
           S 56 90, 42 86
           S 24 88, 16 78
           S 10 64, 14 54
           S 10 40, 14 26"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <path
        d="M18 30 C 14 22, 22 18, 30 20
           S 46 22, 52 18
           S 70 16, 76 20
           S 88 26, 84 38
           S 86 52, 82 60
           S 78 74, 66 78
           S 54 86, 44 82
           S 26 84, 20 76
           S 14 64, 18 56
           S 14 44, 18 30"
        stroke="currentColor"
        strokeWidth={Math.max(1, strokeWidth - 0.5)}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.45"
      />
    </svg>
  );
}

