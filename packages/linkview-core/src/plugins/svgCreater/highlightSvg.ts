import fs from 'fs';
import { Options } from '../../@types/options';
import { renderItem } from './render';
import { SVG_HIGHLIGHT } from './svgTemplates';
import { parseBases } from '../paramsCreater/utils';
import { errorPos, intersection } from '@linkview/linkview-align-parser';

const HIGHLIGHT_DEFAULT_COLOR = 'red';

function parseHighlightFile(highlightFiles: string[]) {
  const highlightsMap: {
    [ctg: string]: {start: number, end: number, color: string}[]
  } = {}
  for (let highlightFile of highlightFiles) {
    const content = fs.readFileSync(highlightFile).toString().trim();
    const lines = content.split('\n');
    for (let index = 0, count = lines.length; index < count; index++) {
      const line = lines[index];
      if (line.startsWith('#')) continue;
      const [ctg, startStr, endStr, color] = line.split(/\s+/);
      const start = parseBases(startStr);
      const end = parseBases(endStr);
      if (isNaN(start)) {
        const errorInfo = errorPos(line, [ctg, startStr, endStr, color], 1);
        throw new Error(
          `${startStr} cannot be resolved to number of bases! in '${highlightFile}' line ${
            index + 1
          }:\n${errorInfo}`
        );
      }
      if (isNaN(end)) {
        const errorInfo = errorPos(line, [ctg, startStr, endStr, color], 1);
        throw new Error(
          `${endStr} cannot be resolved to number of bases! in '${highlightFile}' line ${
            index + 1
          }:\n${errorInfo}`
        );
      }
      if (!(ctg in highlightsMap)) highlightsMap[ctg] = [];
      highlightsMap[ctg].push({
        start,
        end,
        color: color ? color : HIGHLIGHT_DEFAULT_COLOR
      })
    }
  }
  return highlightsMap;
}

export default function highlightSvg(this: Options) {
  const options = this;
  const { layout } = options;
  const svgContents: string[] = [];
  if (!options.highlight) return options;
  const highlightsMap = parseHighlightFile(options.highlight);
  layout.forEach((layoutLine, index) => {
    const drawOptionsItem = options.getDrawOptionsItem!(index);
    layoutLine.forEach((layoutItem) => {
      const { ctg, start, end } = layoutItem;
      const max = Math.max(start, end);
      const min = Math.min(start, end);
      const highlights = highlightsMap[ctg];
      if (!highlights || highlights.length === 0) return;
      for (let highlight of highlights) {
        let { start: hlStart, end: hlEnd, color } = highlight;
        [hlStart, hlEnd] = intersection([max, min], [hlStart, hlEnd]);
        if (hlStart > hlEnd) [hlStart, hlEnd] = [hlEnd, hlStart];
        if (hlStart && hlEnd) {
          // console.log(ctg, hlStart, hlEnd);
          const [xStart, ystart] = layoutItem.getSvgPos!(hlStart, 'top', false);
          const [xEnd] = layoutItem.getSvgPos!(hlEnd, 'top', true);
          // console.log('xStart, xEnd', xStart, xEnd)
          const highlightProps = {
            x: Math.min(xStart, xEnd),
            y: ystart,
            width: Math.abs(xEnd - xStart),
            height: layoutItem.svgProps?.height,
            color
          }
          svgContents.push(renderItem(SVG_HIGHLIGHT, highlightProps));
        }
      }
    });
  });

  if (!options.svg_template) options.svg_template = [];
  options.svg_template.push({ content: svgContents });
  return options;
}
