import fs from 'fs';
import { Options, IntervalInfoByAlignments } from '../../@types/options';
import { Layout, LayoutItem } from '../../@types/layout';
import { errorPos } from '../../utils/error';

const MAX_NUMBER_OF_CTGS = 5;

export default function autoLayoutCreater(this: Options) {
  const options = this;
  let { karyotype, karyotypeContent, layout, alignmentsByCtgs } = options;
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
  if (layout.length === 0 && !karyotype && !karyotypeContent) {
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
    if (ctgs.length === 0) {
      // do nothing
    } else if (ctgs.length === 1) {
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
  return options;
}