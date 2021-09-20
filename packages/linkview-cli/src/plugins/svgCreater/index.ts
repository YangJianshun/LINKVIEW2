import { Options } from '../../@types/options';
import layoutSvg from './layoutSvg';
import { SVG_START, SVG_END } from './svgTemplates';
import { SvgTemplate } from '../../@types/svgTemplate';
import render from './render';

export function svgCreater(this: Options) {
  const options = this;
  const layoutSvgContent = layoutSvg(options);

  const svgTemplate: SvgTemplate = [
    SVG_START,
    {content: layoutSvgContent},
    SVG_END
  ];

  options.svg = render(svgTemplate, options);
}