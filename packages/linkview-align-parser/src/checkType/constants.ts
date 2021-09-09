import { Colum, StrandFlags } from '../@types/characteristics';

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

export const strandFlags: StrandFlags = {
  minimapStrand: ['+', '-'],
  nucmerStrand: ['Plus', 'Minus'],
};

export const numberColumsSet = new Set(numberColums);
