import fs from 'fs';
import { Options } from '../../@types/options';
import { renderItem } from './render';
import { SVG_HIGHLIGHT } from './svgTemplates';
import { parseBases } from '../paramsCreater/utils';
import { errorPos, intersection } from '@linkview/linkview-align-parser';

const HIGHLIGHT_DEFAULT_COLOR = 'red';

type HighlightsMap = {
  [ctg: string]: {start: number, end: number, color: string}[]
};

function assignHighlightsMap(target: HighlightsMap, source: HighlightsMap) {
  for (let ctg in source) {
    if (!(ctg in target)) {
      target[ctg] = source[ctg];
    } else {
      target[ctg].push(...source[ctg]);
    }
  }
}

function parseHighlightFile(highlightFiles: string[]) {
  const highlightsMap: HighlightsMap = {}
  for (let highlightFile of highlightFiles) {
    const content = fs.readFileSync(highlightFile).toString().trim();
    const highlightsMapSingle = parseHighligtContent(content);
    assignHighlightsMap(highlightsMap, highlightsMapSingle);
  }
  return highlightsMap;
}

function parseHighligtContent(
  content: string | undefined,
  fineName: string = 'HIGHLIGHT'
) {
  const highlightsMap: HighlightsMap = {};
  if (!content) return highlightsMap;
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
        `${startStr} cannot be resolved to number of bases! in '${fineName}' line ${
          index + 1
        }:\n${errorInfo}`
      );
    }
    if (isNaN(end)) {
      const errorInfo = errorPos(line, [ctg, startStr, endStr, color], 1);
      throw new Error(
        `${endStr} cannot be resolved to number of bases! in '${fineName}' line ${
          index + 1
        }:\n${errorInfo}`
      );
    }
    if (!(ctg in highlightsMap)) highlightsMap[ctg] = [];
    highlightsMap[ctg].push({
      start,
      end,
      color: color ? color : HIGHLIGHT_DEFAULT_COLOR,
    });
  }
  return highlightsMap;
}

export default function highlightSvg(this: Options) {
  const options = this;
  const { layout } = options;
  const svgContents: string[] = [];
  const {highlight, highlightContent} = options;
  if ((!highlight) && (!highlightContent)) return options;
  const highlightsMap = highlight ? parseHighlightFile(highlight) : parseHighligtContent(highlightContent);
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
          const [xStart, ystart] = layoutItem.getSvgPos!(hlStart, 'top', false);
          const [xEnd] = layoutItem.getSvgPos!(hlEnd, 'top', true);
          let width = Math.abs(xEnd - xStart);
          if (width < 1 && options.hl_min1px) width = 1;
          const highlightProps = {
            x: Math.min(xStart, xEnd),
            y: ystart,
            width,
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
