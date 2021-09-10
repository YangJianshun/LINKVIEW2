/// <reference path="../checkType/constants.ts" />

export enum AlignType {
  UNKNOWN = '0',
  STANDARD = '1',
  BLAST = '2',
  MINIMAP = '3',
  NUCMER = '4',
  NUCMER_T = '5',
  NUCMER_B = '6',
}

export type Column =
  | 'ctg1'
  | 'start1'
  | 'end1'
  | 'len1'
  | 'ctg2'
  | 'start2'
  | 'end2'
  | 'len2'
  | 'color:opacity'
  | 'alignLen'
  | 'identity'
  | 'other'
  | 'evalue'
  | 'bitScore'
  | 'minimapStrand'
  | 'nucmerStrand'
  | 'NUCMER'
  | 'otherNumber';

export type LineCharacteristic = {
  startsWith? : string;
  endsWith? : string;
  content?: string | string[];
  split?: string | RegExp;
  columnCount?: number | number[];
  columns?: {
    [index: number]: Column;
  };
  exclude?: LineCharacteristic
}

export type Characteristic  = {
  all?: LineCharacteristic; // 所有行都必须为某个特征
  include?: LineCharacteristic[]; // 必须包含为某些特征的行
}

export type Characteristics = {
  [key in AlignType]: Characteristic;
};

export type StrandFlags = {
  [key in Column]?: string[];
};
