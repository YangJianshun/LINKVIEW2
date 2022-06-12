import alignParser, { Alignment, AlignmentsByCtgs, calculateSubAlign, alignParserFromContent } from '@linkview/linkview-align-parser';
import { Options, IntervalInfoByAlignments } from '../../@types/options';
import { LayoutItem } from '../../@types/layout';
import { warn } from '../../utils/error';

function assignAlignmentsByCtgs(target: AlignmentsByCtgs, source: AlignmentsByCtgs) {
  for (let ctg1 in source) {
    if (!(ctg1 in target)) {
      target[ctg1] = source[ctg1];
    } else {
      for (let ctg2 in source[ctg1]) {
        if (!(ctg2 in target[ctg1])) {
          target[ctg1][ctg2] = source[ctg1][ctg2];
        } else {
          target[ctg1][ctg2].push(...source[ctg1][ctg2])
        }
      }
    }
  }
}

export default async function alignCreater(this: Options) {
  const options = this;
  const {
    inputs,
    inputContent,
    min_alignment_length: minAlignmentLength,
    min_identity: minIdentity,
    min_bit_score: minBitScore,
    max_evalue: maxEvalue,
    layout
  } = options;
  const lenInfoAll: { [ctg: string]: number } = {};
  const alignmentsAll: Alignment[] = [];
  const alignmentsByCtgsAll: AlignmentsByCtgs = {};
  if (inputs) {
    for (let input of inputs) {
      const { alignments, lenInfo, alignmentsByCtgs } = await alignParser(
        input,
        {
          minIdentity,
          minAlignmentLength,
          maxEvalue,
          minBitScore,
          filterCtgPairs: [],
        }
      );
      Object.assign(lenInfoAll, lenInfo);
      for (const alignment of alignments ) {
        alignmentsAll.push(alignment)
      };
      assignAlignmentsByCtgs(alignmentsByCtgsAll, alignmentsByCtgs);
    }
  } else if (inputContent) {
    const { alignments, lenInfo, alignmentsByCtgs } = alignParserFromContent(
      inputContent,
      {
        minIdentity,
        minAlignmentLength,
        maxEvalue,
        minBitScore,
        filterCtgPairs: [],
      }
    );
    Object.assign(lenInfoAll, lenInfo);
    for (const alignment of alignments ) {
      alignmentsAll.push(alignment)
    };
    assignAlignmentsByCtgs(alignmentsByCtgsAll, alignmentsByCtgs);
  }
  options.alignments = alignmentsAll;
  options.lenInfo = lenInfoAll;
  options.alignmentsByCtgs = alignmentsByCtgsAll;


  for (
    let index = 0, levelCount = layout.length;
    index < levelCount;
    index++
  ) {
    const layoutLineBefore = layout[index - 1];
    const layoutLineCur = layout[index];
    const layoutLineNext = layout[index + 1];

    layoutLineCur.forEach((layoutItemCur) => {
      // 推断没有 start 和 end 信息
      // 没有 start 和 end 信息的 ctgs
      const  ctgsWithNoInfo = new Set<string>();
      // 没有 start 和 end 信息的 layoutItem 后面好直接修改
      const layoutItemsWithNoInfo = new Set<LayoutItem>();
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
      // console.log('layoutItemCur.ctg', layoutItemCur.ctg);
      layoutLineBefore && layoutLineBefore.forEach((layoutItemBefore) => {
        const ctg1 = layoutItemCur.ctg;
        const ctg2 = layoutItemBefore.ctg;
        const { alignmentsByCtgs } = options;
        if (layoutItemCur.start === 0 || layoutItemCur.end === 0) {
          ctgsWithNoInfo.add(layoutItemCur.ctg);
          layoutItemsWithNoInfo.add(layoutItemCur);
        }
        
        // alignment 裁剪
        const alignments =
          ctg1 in alignmentsByCtgs
            ? ctg2 in alignmentsByCtgs[ctg1]
              ? alignmentsByCtgs[ctg1][ctg2]
              : []
            : [];
        if (!alignments || alignments.length === 0) return;
        for (let index = 0, count = alignments.length; index < count; index++) {
          const alignment = alignments[index];
          const displayStart1 = layoutItemCur.ctg === alignment.ctg1 ? layoutItemCur.start : layoutItemBefore.start;
          const displayEnd1 = layoutItemCur.ctg === alignment.ctg1 ? layoutItemCur.end : layoutItemBefore.end;
          const displayStart2 = layoutItemCur.ctg === alignment.ctg2 ? layoutItemCur.start : layoutItemBefore.start;
          const displayEnd2 = layoutItemCur.ctg === alignment.ctg2 ? layoutItemCur.end : layoutItemBefore.end;
          const calculatedAlignment = calculateSubAlign(alignment, displayStart1, displayEnd1, displayStart2, displayEnd2);
          // console.log('calculatedAlignment', calculatedAlignment);
          if (!calculatedAlignment) continue;
          const { ctg1, start1, end1, ctg2, start2, end2 } = calculatedAlignment;
          const [startCur, endCur] = layoutItemCur.ctg === ctg1 ? [start1, end1] : [start2, end2];
          setIntervalInfo(layoutItemCur.ctg, startCur, endCur);
        }
      });
      // console.log('intervalInfoByAlignments1', intervalInfoByAlignments);
      layoutLineNext && layoutLineNext.forEach((layoutItemNext) => {
        const ctg1 = layoutItemCur.ctg;
        const ctg2 = layoutItemNext.ctg;
        const { alignmentsByCtgs } = options;
        if (layoutItemCur.start === 0 || layoutItemCur.end === 0) {
          ctgsWithNoInfo.add(layoutItemCur.ctg);
          layoutItemsWithNoInfo.add(layoutItemCur);
        }
        
        // alignment 裁剪
        const alignments =
          ctg1 in alignmentsByCtgs
            ? ctg2 in alignmentsByCtgs[ctg1]
              ? alignmentsByCtgs[ctg1][ctg2]
              : []
            : [];
        if (!alignments || alignments.length === 0) return;
        for (let index = 0, count = alignments.length; index < count; index++) {
          const alignment = alignments[index];
          const displayStart1 = layoutItemCur.ctg === alignment.ctg1 ? layoutItemCur.start : layoutItemNext.start;
          const displayEnd1 = layoutItemCur.ctg === alignment.ctg1 ? layoutItemCur.end : layoutItemNext.end;
          const displayStart2 = layoutItemCur.ctg === alignment.ctg2 ? layoutItemCur.start : layoutItemNext.start;
          const displayEnd2 = layoutItemCur.ctg === alignment.ctg2 ? layoutItemCur.end : layoutItemNext.end;
          const calculatedAlignment = calculateSubAlign(alignment, displayStart1, displayEnd1, displayStart2, displayEnd2);
          // console.log('calculatedAlignment', calculatedAlignment);
          if (!calculatedAlignment) continue;
          const { ctg1, start1, end1, ctg2, start2, end2 } = calculatedAlignment;
          const [startCur, endCur] = layoutItemCur.ctg === ctg1 ? [start1, end1] : [start2, end2];
          setIntervalInfo(layoutItemCur.ctg, startCur, endCur);
        }
      });
      // console.log('intervalInfoByAlignments2', intervalInfoByAlignments);
      for (let layoutItem of layoutItemsWithNoInfo) {
        const { ctg } = layoutItem;
        if (!intervalInfoByAlignments[ctg]) continue;
        layoutItem.start = intervalInfoByAlignments[ctg].start;
        layoutItem.end = intervalInfoByAlignments[ctg].end;
        warn(`${ctg} lacks start and end information. It automatically calculates that start is ${layoutItem.start} and end is ${layoutItem.end}.`);
      }
    });
  }
  // if (ctgsWithNoInfo.size <= 0 ) return options;

  return options;
}
