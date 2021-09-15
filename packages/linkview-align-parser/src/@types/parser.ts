import { LineCharacteristic, Column } from './characteristics';

export type ParserOpt = {
  split: string | RegExp;
  filters?: LineCharacteristic[];
  columns: {
    [index: number]: Column;
  };
} | null;
