import { Options } from '../../@types/options';
import { SVG_SCALE_LINE, SVG_SCALE_TEXT } from './svgTemplates';
import { renderItem } from './render';

// 绘制比例尺的像素宽度
const SCALE_SVG_WIDTH = 150;
const SCALE_SVG_HEIGHT = 5;
const suffixMap = {
  '00 Mb': 100000000,
  '0 Mb': 10000000,
  'Mb': 1000000,
  '00 Kb': 100000,
  '0 Kb': 10000,
  'Kb': 1000,
  '00 bp': 100,
  '0 bp': 10,
  'bp': 1,
}

export default function scaleSvg(this: Options) {
  const options = this;
  const { scale, show_scale, svg_width, svg_space, svg_height } = options;
  if (!show_scale) return options;
  const svgContents: string[] = [];
  // options.scale 表示 一个 bp 对应多少 px
  const basesPer1Px = 1 / scale!;
  let scaleBases = basesPer1Px * SCALE_SVG_WIDTH;
  let text = '';
  const suffixs = Object.keys(suffixMap).sort((a, b) => suffixMap[b as keyof typeof suffixMap] - suffixMap[a as keyof typeof suffixMap]);
  for (let suffix of suffixs) {
    const unit = suffixMap[suffix as keyof typeof suffixMap];
    if (scaleBases > unit) {
      const count = Number((scaleBases / unit).toFixed(0));
      scaleBases = count * unit;
      text = `${count}${suffix}`;
      break;
    }
  }

  // console.log(scaleBases, text);
  const scaleX = svg_width * (1 - svg_space / 2) - scaleBases * scale!;
  const scaleY = svg_height * 0.9;
  // args.svg_width*(1-args.svg_space/2)-L*scale;scale_y=args.svg_height*0.9
  svgContents.push(renderItem(SVG_SCALE_LINE, {
    x1: scaleX,
    y1: scaleY - SCALE_SVG_HEIGHT,
    x2: scaleX,
    y2: scaleY,
    x3: scaleX + scaleBases * scale!,
    y3: scaleY,
    x4: scaleX + scaleBases * scale!,
    y4: scaleY - SCALE_SVG_HEIGHT,
  }))
  const textWidth = options.label_font_size * text.length / 2;
  svgContents.push(renderItem(SVG_SCALE_TEXT, {
    x: scaleX + (scaleBases * scale! - textWidth) / 2,
    y: scaleY - 2 * SCALE_SVG_HEIGHT,
    fontSize: options.label_font_size,
    text,
  }))
  if (!options.svg_template) options.svg_template = [];
  options.svg_template.push({ content: svgContents });
  return options;
}