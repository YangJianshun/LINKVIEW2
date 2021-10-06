import fs from 'fs';
import eachLine from '../utils/eachLine';
import checkTypeByHeadLines from './checkTypeByHeadLines';
import getParseOptions from './getParserOpt';
import { warn } from '../utils/error';
import { AlignType } from '..';

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
    alignType === AlignType.UNKNOWN &&  warn('Unknown input alignment type!');
    return {
      alignType,
      parserOpt: getParseOptions(alignType, headLines),
    };
  });
}

export function checkTypeFromContent(content: String) {
  const headLines = content.trim().split('\n').slice(0, 5);
  const alignType = checkTypeByHeadLines(headLines);
  return {
    alignType,
    parserOpt: getParseOptions(alignType, headLines),
    warnMsg: alignType === AlignType.UNKNOWN ? 'Unknown input alignment type!' : '',
  };
}
