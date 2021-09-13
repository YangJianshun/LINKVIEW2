import { FilterAlignOpt } from '../@types/filterAlign';
import { Alignment } from '../@types/alignment';

// ctg1 ctg2 是否在 ctgPair 数组中
const ctgsInCtgPairs = (
  ctgPairs: [string, string][],
  ctg1: string,
  ctg2: string
) =>
  ctgPairs.findIndex(
    ([filterCtg1, filterCtg2]) =>
      (filterCtg1 === ctg1 && filterCtg2 === ctg2) ||
      (filterCtg1 === ctg2 && filterCtg2 === ctg1)
  ) >= 0;

const filterAlignCreater =
  (filterAlignOpt: FilterAlignOpt) => (alignment: Alignment) => {
    const { alignLen, identity, evalue, bitScore, ctg1, ctg2 } = alignment;
    const {
      minAlignmentLength,
      minIdentity,
      maxEvalue,
      minBitScore,
      filterCtgPairs,
    } = filterAlignOpt;
    if (minAlignmentLength && alignLen < minAlignmentLength) return true;
    if (minIdentity && identity && identity < minIdentity) return true;
    if (evalue && maxEvalue !== undefined && evalue > maxEvalue) return true;
    if (bitScore && minBitScore && bitScore < minBitScore) return true;
    if (filterCtgPairs && ctgsInCtgPairs(filterCtgPairs, ctg1, ctg2)) return true;
    return false;
  };

export default filterAlignCreater;
