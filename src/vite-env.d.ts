/// <reference types="vite/client" />
/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
  }
  
  interface SvgrComponent extends React.FunctionComponent<React.SVGAttributes<SVGElement>> {}
  
  declare module '*.svg' {
    const content: string;    
    export const ReactComponent: SvgrComponent;

  }
 