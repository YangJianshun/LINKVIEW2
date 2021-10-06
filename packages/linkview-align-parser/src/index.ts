import alignParser, { alignParserFromContent } from './main';
// import { withErrorConsole } from './utils/error';

export * from './@types';
export * from './calculateSubAlign';
export * from './parser';
export * from './utils';
export { alignParserFromContent } from './main';
export default alignParser;
// export default alignParser;

// alignParser('./__tests__/alignments/alignments.Br.nucmer', {
//   minIdentity: 90,
//   minBitScore: 3000,
//   filterCtgPairs: [['ctg1', 'ctg3']],
//   minAlignmentLength: 2000,
// }).then(({ alignments, alignType, lenInfo }) => {
//   console.log(alignType);
//   console.log(alignments);
//   console.log(lenInfo)
// });
