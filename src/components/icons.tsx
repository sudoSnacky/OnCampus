import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <span className="font-headline font-bold text-2xl" {...props}>
      <span style={{ color: '#4285F4' }}>&lt;</span>
      <span> </span>
      <span style={{ color: '#DB4437' }}>O</span>
      <span style={{ color: '#F4B400' }}>N</span>
      <span> </span>
      <span style={{ color: '#4285F4' }}>C</span>
      <span style={{ color: '#0F9D58' }}>A</span>
      <span style={{ color: '#DB4437' }}>M</span>
      <span style={{ color: '#F4B400' }}>P</span>
      <span style={{ color: '#4285F4' }}>U</span>
      <span style={{ color: '#0F9D58' }}>S</span>
      <span> </span>
      <span style={{ color: '#0F9D58' }}>&gt;</span>
    </span>
  ),
};
