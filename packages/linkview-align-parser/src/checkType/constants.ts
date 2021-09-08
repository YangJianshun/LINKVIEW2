export enum AlignType {
  STANDARD,
  BLAST,
  MINIMAP,
  NUCMER,
  NUCMER_T,
  NUCMER_B,
}

export const numberColums: Colum[] = [
  'start1',
  'end1',
  'len1',
  'start2',
  'end2',
  'len2',
  'alignLen',
  'identity',
  'evalue',
  'bitScore',
  'otherNumber',
];

type StrandFlags = {
  [key in Colum]?: string[];
};

export const strandFlags: StrandFlags = {
  minimapStrand: ['+', '-'],
  nucmerStrand: ['Plus', 'Minus'],
};

export const numberColumsSet = new Set(numberColums);
