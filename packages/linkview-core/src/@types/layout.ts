import { SvgProps } from './svgTemplate';

export type Highlight = {
  start: number;
  end: number;
  color: string;
};
export type LayoutItem = {
  ctg: string;
  start: number;
  end: number;
  highlights?: Highlight[];
  svgHeight?: number;
  svgProps?: SvgProps;
  getSvgPos?: (xPos: number, yPos: 'top' | 'bottom', isLargerPos?: boolean) => [svgXPos: number, svgYPos: number];
  leftDash: boolean;
  rightDash: boolean;
};

export type LayoutLine = LayoutItem[];

export type Layout = LayoutLine[];
