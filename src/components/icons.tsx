import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <span className="font-headline font-bold text-2xl" {...props}>
      <span style={{ color: '#4285F4' }}>&lt;</span>
      <span style={{ color: '#DB4437' }}> O</span>
      <span style={{ color: '#F4B400' }}>N</span>
      <span> CAMPUS </span>
      <span style={{ color: '#0F9D58' }}>&gt;</span>
    </span>
  ),
};
