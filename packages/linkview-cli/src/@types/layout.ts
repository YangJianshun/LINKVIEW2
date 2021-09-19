export type Highlight = {
  start: number,
  end: number,
  color: string;
}
export type LayoutItem = {
  ctg: string;
  start: number;
  end: number;
  highlights?: Highlight[]
}

export type LayoutLine = LayoutItem[];

export type Layout = LayoutLine[];