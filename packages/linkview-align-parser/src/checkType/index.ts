import fs from 'fs';
import eachLine from '../utils/eachLine';
import checkTypeByHeadLines from './checkTypeByHeadLines';
import getParseOptions from './getParserOpt';

const LINE_COUNT = 5; // 默认读文件的前10行，来判断文件类型

export default function checkType(fileName: string) {
  const headLines: string[] = [];

  if (!fs.existsSync(fileName))
    throw new Error(`${fileName} does not exist, please check!`);

  return eachLine(
    fileName,
    (line, lineIndex) => {
      headLines.push(line);
      if (lineIndex >= LINE_COUNT) return false;
    },
    (line) => {
      return line.startsWith('#') || line === '';
    }
  ).then(() => {
    const alignType = checkTypeByHeadLines(headLines);
    return {
      alignType,
      parserOpt: getParseOptions(alignType, headLines),
    };
  });
}

// (async () => {
//   const res = await(checkType('../../__tests__/alignments/alignments.standard.tab'));
//   console.log(res);
// })()