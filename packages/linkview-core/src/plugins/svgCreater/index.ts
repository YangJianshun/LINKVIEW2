import { Options } from '../../@types/options';
import layoutSvg from './layoutSvg';
import { SVG_START, SVG_END } from './svgTemplates';
import render from './render';
import styleSvg from './styleSvg';
import labelSvg from './labelSvg';
import alignmentSvg from './alignmentSvg';
import axisSvg from './axisSvg';
import highlightSvg from './highlightSvg';

export default function svgCreater(this: Options) {
  const options = this;
  options.use(styleSvg);
  options.use(layoutSvg);
  options.use(labelSvg);
  options.use(alignmentSvg);
  options.use(highlightSvg);
  options.use(axisSvg);

  options.svg_template?.unshift(SVG_START);
  options.svg_template?.push(SVG_END);
  options.svg = render(options.svg_template!, options);
}