type Colum =
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

type LineCharacteristic = {
  startsWith? : string;
  endsWith? : string;
  content?: string | string[];
  split?: string | RegExp;
  columnCount?: number | number[];
  columns?: {
    [index: number]: Colum;
  };
  exclude?: LineCharacteristic
}

type Characteristic  = {
  all?: LineCharacteristic; // 所有行都必须为某个特征
  include?: LineCharacteristic[]; // 必须包含为某些特征的行
}

type Characteristics = {
  [key in AlignType]: Characteristic;
};