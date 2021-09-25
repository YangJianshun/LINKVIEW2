import { Options } from '../../@types/options';
import { renderItem } from './render';
import { SVG_LABEL } from './svgTemplates';

export default function labelSvg(this: Options) {
  const options = this;
  const { layout, drawOptions } = options;
  let svgContents: string[] = [];
  layout.forEach((layoutLine, index) => {
    const drawOptionsItem = drawOptions![index];
    layoutLine.forEach((layoutItem) => {
      let [x, y] =
        drawOptionsItem.label_pos === 'left'
          ? layoutItem.getSvgPos!(1, 'bottom')
          : drawOptionsItem.label_pos === 'center'
          ? layoutItem.getSvgPos!(
              layoutItem.start + (layoutItem.end - layoutItem.start) / 2,
              'bottom'
            )
          : layoutItem.getSvgPos!(layoutItem.end, 'bottom');
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
}
