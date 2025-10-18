import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 258 52"
      {...props}
    >
      <path
        fill="#4285F4"
        d="M28.46 25.95L.29 42.41a2 2 0 01-2.24-2.83L25.33 23.1a2 2 0 01-.01-2.83L-1.95 3.8a2 2 0 012.24-2.83l28.17 16.46a2 2 0 01.01 5.66v2.86z"
        transform="translate(2.25 2.87)"
      ></path>
      <path
        fill="#EA4335"
        d="M28.46 2.86L.29 19.32A2 2 0 01-1.95 16.5L25.33.02a2 2 0 01.01 2.83v-.01L-1.95 29.3a2 2 0 012.24 2.83l28.17-16.46a2 2 0 010-5.66V2.86z"
        transform="translate(2.25 2.87)"
      ></path>
      <text
        x="45"
        y="32"
        fill="hsl(var(--foreground))"
        fontFamily="Poppins, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="-.5"
      >
        OnCampus
      </text>
      <path
        fill="#34A853"
        d="M229.54 2.86l28.17 16.46a2 2 0 01-2.24 2.83L230.19 5.63a2 2 0 010 2.83l27.28 16.46a2 2 0 01-2.24 2.83l-28.17-16.46a2 2 0 010-5.66V2.86z"
        transform="translate(2.25 2.87)"
      ></path>
      <path
        fill="#FBBC05"
        d="M229.54 25.95l28.17 16.46a2 2 0 01-2.24-2.83L230.19 23.1a2 2 0 010-2.83L257.47 3.8a2 2 0 01-2.24-2.83l-28.17 16.46a2 2 0 01.01 5.66v2.86z"
        transform="translate(2.25 2.87)"
      ></path>
    </svg>
  ),
};
