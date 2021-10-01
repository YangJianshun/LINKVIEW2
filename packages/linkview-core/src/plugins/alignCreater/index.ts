import alignParser, { Alignment, AlignmentsByCtgs } from '@linkview/linkview-align-parser';
import { Options } from '../../@types/options';

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
    min_alignment_length: minAlignmentLength,
    min_identity: minIdentity,
    min_bit_score: minBitScore,
    max_evalue: maxEvalue,
  } = options;
  const lenInfoAll: { [ctg: string]: number } = {};
  const alignmentsAll: Alignment[] = [];
  const alignmentsByCtgsAll: AlignmentsByCtgs = {};
  for (let input of inputs) {
    const { alignments, lenInfo, alignmentsByCtgs } = await alignParser(input, {
      minIdentity,
      minAlignmentLength,
      maxEvalue,
      minBitScore,
      filterCtgPairs: [],
    });
    Object.assign(lenInfoAll, lenInfo);
    alignmentsAll.push(...alignments);
    assignAlignmentsByCtgs(alignmentsByCtgsAll, alignmentsByCtgs);
  }
  options.alignments = alignmentsAll;
  options.lenInfo = lenInfoAll;
  options.alignmentsByCtgs = alignmentsByCtgsAll;
  return options;
}
