import { Alignment, AlignmentsByCtgs } from "@linkview/linkview-align-parser";

export function assignAlignmentsByCtgs(
  target: AlignmentsByCtgs,
  source: AlignmentsByCtgs
) {
  for (let ctg1 in source) {
    if (!(ctg1 in target)) {
      target[ctg1] = source[ctg1];
    } else {
      for (let ctg2 in source[ctg1]) {
        if (!(ctg2 in target[ctg1])) {
          target[ctg1][ctg2] = source[ctg1][ctg2];
        } else {
          target[ctg1][ctg2].push(...source[ctg1][ctg2]);
        }
      }
    }
  }
}

export function getAlignmentsByCtgs(alignments: Alignment[]) {
  const alignmentsByCtgs: AlignmentsByCtgs = {};
  for (const alignment of alignments) {
    const { ctg1, ctg2 } = alignment;
    if (!(ctg1 in alignmentsByCtgs)) alignmentsByCtgs[ctg1] = {};
    if (!(ctg2 in alignmentsByCtgs[ctg1])) alignmentsByCtgs[ctg1][ctg2] = [];
    if (!(ctg2 in alignmentsByCtgs)) alignmentsByCtgs[ctg2] = {};
    if (!(ctg1 in alignmentsByCtgs[ctg2])) alignmentsByCtgs[ctg2][ctg1] = [];
    alignmentsByCtgs[ctg1][ctg2].push(alignment) &&
      alignmentsByCtgs[ctg2][ctg1].push(alignment);
  }
  return alignmentsByCtgs;
}
