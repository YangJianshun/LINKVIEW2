import { Options } from '../../@types/options';
import { styles } from './svgTemplates';

export default function styleSvg(this: Options) {
  const options = this;
  const svgContents: string[] = [];
  if (!options.svg_template) options.svg_template = [];
  options.svg_template.push({ content: svgContents });
  if (options.style in styles) {
    options.svg_template.push({ content: styles[options.style] });
  }
  return options;
}
