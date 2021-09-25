import { Layout } from './layout';
import { SvgTemplate } from './svgTemplate';

export type DrawOptionsItem = {
  chro_thickness: number;
  no_label: boolean;
  label_font_size: number;
  label_angle: number;
  label_pos: 'center'| 'left' | 'right';
  chro_axis: boolean;
  gap_length: number;
  align: 'center' | 'left' | 'right';
  label_x_offset: number;
  label_y_offset: number;
};

export type Options = {
  inputs: string[];
  min_alignment_length: number;
  min_identity: number;
  min_bit_score: number;
  max_evalue: number;
  chro_thickness: number;
  no_label: boolean;
  label_font_size: number;
  label_angle: number;
  label_pos: 'center'| 'left' | 'right';
  label_x_offset: number;
  label_y_offset: number;
  gap_length: number;
  svg_height: number;
  svg_width: number;
  svg_content_width: number;
  svg_space: number;
  karyotype?: string;
  highlight?: string[];
  hl_min1px?: boolean;
  gff?: string[];
  scale?: number;
  chro_axis?: boolean;
  align: 'center' | 'left' | 'right';
  parameter?: string;
  layout: Layout;
  svg_template?: SvgTemplate;
  svg?: string;
  use: (plugin: (...args: any) => void) => void;
  drawOptions?: DrawOptionsItem[];
};
