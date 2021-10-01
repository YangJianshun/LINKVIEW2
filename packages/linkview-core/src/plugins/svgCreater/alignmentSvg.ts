import { Alignment, calculateSubAlign } from '@linkview/linkview-align-parser';
import { Options } from '../../@types/options';
import { renderItem } from './render';
import { SVG_ALIGN } from './svgTemplates';

export default function labelSvg(this: Options) {
  const options = this;
  const { layout, alignmentsByCtgs } = options;
  let svgContents: string[] = [];
  for (let index = 0, levelCount = layout.length; index < levelCount - 1; index++) {
    const layoutLineCur = layout[index];
    const layoutLineNext = layout[index + 1];
    layoutLineCur.forEach(layoutItemCur => {
      layoutLineNext.forEach(layoutItemNext => {
        const ctg1 = layoutItemCur.ctg;
        const ctg2 = layoutItemNext.ctg;
        const alignments =
          ctg1 in alignmentsByCtgs
            ? ctg2 in alignmentsByCtgs[ctg1]
              ? alignmentsByCtgs[ctg1][ctg2]
              : []
            : [];
        if (!alignments) return;
        alignments.forEach(alignment => {
          // 裁剪 alignment
          const displayStart1 = layoutItemCur.ctg === alignment.ctg1 ? layoutItemCur.start : layoutItemNext.start;
          const displayEnd1 = layoutItemCur.ctg === alignment.ctg1 ? layoutItemCur.end : layoutItemNext.end;
          const displayStart2 = layoutItemCur.ctg === alignment.ctg2 ? layoutItemCur.start : layoutItemNext.start;
          const displayEnd2 = layoutItemCur.ctg === alignment.ctg2 ? layoutItemCur.end : layoutItemNext.end;
          const calculatedAlignment = calculateSubAlign(alignment, displayStart1, displayEnd1, displayStart2, displayEnd2);

          if (!calculatedAlignment) return;
          let { start1, end1, start2, end2 } = calculatedAlignment;
          if (!(alignment.ctg1 === ctg1)) {
            [start1, start2] = [start2, start1];
            [end1, end2] = [end2, end1];
          }
          const [x1, y1] = layoutItemCur.getSvgPos!(start1, 'bottom', start1 === Math.max(start1, end1));
          const [x2, y2] = layoutItemNext.getSvgPos!(start2, 'top', start2 === Math.max(start2, end2));
          const [x3, y3] = layoutItemNext.getSvgPos!(end2, 'top', end2 === Math.max(start2, end2));
          const [x4, y4] = layoutItemCur.getSvgPos!(end1, 'bottom', end1 === Math.max(start1, end1));
          console.log('[x2, y2]', [x2, y2])
          console.log('[x3, y3]', [x3, y3])
          const alignProps = {
            x1,
            y1,
            x2,
            y2,
            x3,
            y3,
            x4,
            y4,
            fill: 'green',
            opacity: 0.5,
          }
          svgContents.push(renderItem(SVG_ALIGN, alignProps));
          })
        // console.log(ctg1, ctg2, alignments);
      })
    })

  }
  if (!options.svg_template) options.svg_template = [];
  options.svg_template.push({ content: svgContents });
  return options;
}
