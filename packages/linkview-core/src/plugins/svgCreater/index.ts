import { Options } from '../../@types/options';
import layoutSvg from './layoutSvg';
import { SVG_START, SVG_END } from './svgTemplates';
import { SvgTemplate } from '../../@types/svgTemplate';
import render from './render';
import labelSvg from './labelSvg';

export default function svgCreater(this: Options) {
  const options = this;
  options.use(layoutSvg);
  console.log('3,1~~~');
  options.use(labelSvg);
  console.log('3,2~~~');
  // options.use(alignmentSvg);

  options.svg_template?.unshift(SVG_START);
  options.svg_template?.push(SVG_END);
  options.svg = render(options.svg_template!, options);
  console.log(options.svg);
}