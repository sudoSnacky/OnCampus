import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
    >
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        fill="currentColor"
        d="M128 24a32.1 32.1 0 0 0-32 32 32.1 32.1 0 0 0 32 32 32.1 32.1 0 0 0 32-32 32.1 32.1 0 0 0-32-32Zm0 48a16 16 0 1 1 16-16 16 16 0 0 1-16 16Z"
      />
      <path
        fill="currentColor"
        d="M216 100h-48.8a64.5 64.5 0 0 0-24.5-24.5V27.2a12 12 0 1 0-24 0V75.5A64.5 64.5 0 0 0 94.2 100H40a12 12 0 0 0-12 12v.8A107.4 107.4 0 0 0 128 232a107.4 107.4 0 0 0 100-119.2v-.8a12 12 0 0 0-12-12Zm-88 108.8V132a12 12 0 0 0-24 0v76.8A83.1 83.1 0 0 1 40.7 124H84a76.1 76.1 0 0 1 7.2-24h33.6a76.1 76.1 0 0 1 7.2 24h43.3a83.1 83.1 0 0 1-63.3 84.8Z"
      />
    </svg>
  ),
};
