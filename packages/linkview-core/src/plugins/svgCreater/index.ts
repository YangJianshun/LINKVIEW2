import { Options } from '../../@types/options';
import layoutSvg from './layoutSvg';
import { SVG_START, SVG_END } from './svgTemplates';
import render from './render';
import labelSvg from './labelSvg';
import alignmentSvg from './alignmentSvg';

export default function svgCreater(this: Options) {
  const options = this;
  options.use(layoutSvg);
  options.use(labelSvg);
  options.use(alignmentSvg);

  options.svg_template?.unshift(SVG_START);
  options.svg_template?.push(SVG_END);
  options.svg = render(options.svg_template!, options);
  console.log(options.svg);
}