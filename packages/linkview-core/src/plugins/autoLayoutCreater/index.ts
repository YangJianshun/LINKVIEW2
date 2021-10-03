import fs from 'fs';
import { Options, IntervalInfoByAlignments } from '../../@types/options';
import { Layout, LayoutItem } from '../../@types/layout';
import { errorPos } from '../../utils/error';

const MAX_NUMBER_OF_CTGS = 5;

export default function autoLayoutCreater(this: Options) {
  const options = this;
  let { karyotype, layout, alignmentsByCtgs } = options;
  const intervalInfoByAlignments: IntervalInfoByAlignments = {};
  const setIntervalInfo = (ctg: string, start: number, end: number) => {
    const min = Math.min(start, end);
    const max = Math.max(start, end);
    if (!(ctg in intervalInfoByAlignments))
      intervalInfoByAlignments[ctg] = { start: min, end: max };
    else {
      intervalInfoByAlignments[ctg] = {
        start: Math.min(min, intervalInfoByAlignments[ctg].start),
        end: Math.max(max, intervalInfoByAlignments[ctg].end),
      };
    }
  };
  if (layout.length === 0 && !karyotype) {
    const ctgs = Object.keys(alignmentsByCtgs);
    for (let ctg of ctgs) {
      for (let ctgAnother in alignmentsByCtgs[ctg]) {
        const ailgnments = alignmentsByCtgs[ctg][ctgAnother];
        ailgnments.forEach(alignment => {
          const { ctg1, start1, end1, ctg2, start2, end2 } = alignment;
          setIntervalInfo(ctg1, start1, end1);
          setIntervalInfo(ctg2, start2, end2);
        })
      }
    }
    ctgs.sort((a, b) => {
      const lenA = intervalInfoByAlignments[a].end - intervalInfoByAlignments[a].start;
      const lenB = intervalInfoByAlignments[b].end - intervalInfoByAlignments[b].start;
      return lenB - lenA;
    })
    const ctg2LayoutItem = (ctg: string) => {
      return {
        ctg,
        start: intervalInfoByAlignments[ctg].start,
        end: intervalInfoByAlignments[ctg].end,
      } as LayoutItem;
    }
    if (ctgs.length === 1) {
      layout.push([ctg2LayoutItem(ctgs[0])]);
    } else if (ctgs.length === 2) {
      layout.push([ctg2LayoutItem(ctgs[1])], [ctg2LayoutItem(ctgs[0])]);
    } else if (ctgs.length === 3) {
      layout.push([ctg2LayoutItem(ctgs[1])], [ctg2LayoutItem(ctgs[2])], [ctg2LayoutItem(ctgs[0])]);
    } else if (ctgs.length === 4) {
      layout.push([ctg2LayoutItem(ctgs[1]), ctg2LayoutItem(ctgs[2])], [ctg2LayoutItem(ctgs[3]) , ctg2LayoutItem(ctgs[0])]);
    } else {
      layout.push([ctg2LayoutItem(ctgs[2]), ctg2LayoutItem(ctgs[3])], [ctg2LayoutItem(ctgs[0])], [ctg2LayoutItem(ctgs[4]) , ctg2LayoutItem(ctgs[1])]);
    }

  }
  // if (karyotype) {
  //   const karyotypeContent = fs.readFileSync(karyotype).toString().trim();
  //   const lines = karyotypeContent.split('\n');
  //   for (let index = 0, lineCount = lines.length; index < lineCount; index++) {
  //     const line = lines[index].trim();
  //     const items = line.split(/\s+/);
  //     layout.push([])
  //     for (let item of items) {
  //       const leftDash = item.startsWith('-');
  //       const rightDash = item.endsWith('-');
  //       item = item.replace(/^-*/, '').replace(/-*$/, '');
  //       const [ctg, startStr, endStr] = item.split(':');
  //       const noIntervalInfo =  startStr === undefined && endStr === undefined
  //       const start = noIntervalInfo ? 0 : Number(startStr);
  //       const end = noIntervalInfo ? 0 : Number(endStr);
  //       if (isNaN(start) || isNaN(end)) {
  //         const errStr = isNaN(start) ? startStr : endStr;
  //         const errorPosInfo = errorPos(line, errStr, item);
  //         throw new Error(`format error at karyotype file '${karyotype}' line ${index + 1}\n${errorPosInfo}\n'${errStr}' is not a number!`);
  //       }
  //       layout[index].push({ctg, start, end, leftDash, rightDash})
  //     }
  //   }
  // }
  return options;
}