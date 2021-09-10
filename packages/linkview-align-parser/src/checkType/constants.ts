import { Column, StrandFlags } from '../@types/characteristics';

export const numberColumns: Column[] = [
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

export const numberColumnsSet = new Set(numberColumns);
