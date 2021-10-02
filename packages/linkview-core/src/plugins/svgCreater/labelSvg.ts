import { Options } from '../../@types/options';
import { renderItem } from './render';
import { SVG_LABEL } from './svgTemplates';

export default function labelSvg(this: Options) {
  const options = this;
  const { layout } = options;
  const svgContents: string[] = [];
  layout.forEach((layoutLine, index) => {
    const drawOptionsItem = options.getDrawOptionsItem!(index);
    if (drawOptionsItem.no_label) return;
    layoutLine.forEach((layoutItem) => {
      let [x, y] =
        drawOptionsItem.label_pos === 'left'
          ? layoutItem.getSvgPos!(
              layoutItem.start,
              'bottom',
              layoutItem.end < layoutItem.start
            )
          : drawOptionsItem.label_pos === 'center'
          ? layoutItem.getSvgPos!(
              layoutItem.start + (layoutItem.end - layoutItem.start) / 2,
              'bottom',
              layoutItem.end < layoutItem.start
            )
          : layoutItem.getSvgPos!(
              layoutItem.end,
              'bottom',
              layoutItem.end > layoutItem.start
            );
      y += drawOptionsItem.label_font_size;
      // offset
      x += drawOptionsItem.label_x_offset;
      y += drawOptionsItem.label_y_offset;
      const labelProps = {
        x,
        y,
        label_font_size: drawOptionsItem.label_font_size,
        label_angle: drawOptionsItem.label_angle,
        ctg: layoutItem.ctg,
      };
      svgContents.push(renderItem(SVG_LABEL, labelProps));
    });
  });

  if (!options.svg_template) options.svg_template = [];
  options.svg_template.push({ content: svgContents });
  return options;
}
