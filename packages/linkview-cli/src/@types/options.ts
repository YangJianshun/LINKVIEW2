import { Layout } from './layout';
export type Options = {
  inputs: string[],
  min_alignment_length: number;
  min_identity: number;
  min_bit_score: number;
  max_evalue: number;
  chro_thickness: number;
  label_font_size: number;
  label_angle: number;
  gap_length: number;
  svg_height: number;
  svg_width: number;
  svg_space: number;
  karyotype?: string;
  highlight?: string[];
  hl_min1px?: boolean;
  gff?: string[];
  scale?: string;
  chro_axis?: boolean;
  parameter?: string;
  layout: Layout;
  use: (plugin: (...args: any) => void) => void;
}