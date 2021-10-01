
export type Alignment = {
  ctg1: string;
  start1: number;
  end1: number;
  ctg2: string;
  start2: number;
  end2: number;
  color: string;
  opacity: number;
  alignLen: number;
  identity?: number;
  evalue?: number;
  bitScore?: number;
  len1?: number;
  len2?: number;
};

export type AlignmentsByCtgs = {
  [ctg1: string]: {
    [ctgs: string]: Alignment[]
  }
}