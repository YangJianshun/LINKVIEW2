import alignParser from './main';

export default alignParser;

alignParser('./__tests__/alignments/alignments.rcl.nucmer', {
  minIdentity: 90,
  minBitScore: 3000,
  filterCtgPairs: [['ctg1', 'ctg3']],
  minAlignmentLength: 2000,
}).then(({ alignments, alignType, lenInfo }) => {
  console.log(alignType);
  console.log(alignments);
  console.log(lenInfo)
});