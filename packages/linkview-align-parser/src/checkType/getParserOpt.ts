import characteristics from '../checkType/characteristics';
import { AlignType, LineCharacteristic, Column } from '../@types/characteristics';
import { ParserOpt } from '../@types/parser';

const calcNucmerParseOpt = (headLines: string[]): ParserOpt => {
  const filters: LineCharacteristic[] = [
    {startsWith: 'NUCMER', endsWith: 'NUCMER'},
    {startsWith: '/'},
    {startsWith: '[', endsWith: ']'},
    {startsWith: '=', endsWith: '='}
  ]
  const split: string | RegExp = /\s+\|\s+|\s+/;
  const splitT: string | RegExp = /\s+/;
  const parseOpt: ParserOpt = {
    split: split as string | RegExp,
    filters,
    columns: [] as Column[],
  }
  const columnsMap: {
    [key: string]: Column,
  } = {
    '[S1]': 'start1',
    '[E1]': 'end1',
    '[S2]': 'start2',
    '[E2]': 'end2',
    '[LEN 1]': 'alignLen',
    '[LEN 2]': 'alignLen',
    '[LEN R]': 'len1',
    '[LEN Q]': 'len2',
    '[COV R]': 'otherNumber',
    '[COV Q]': 'otherNumber',
    '[% IDY]': 'identity',
    '[TAG1]': 'ctg1',
    '[TAG2]': 'ctg2',
  }
  headLines.findIndex(line => {
    line = line.trim();

    if (line.startsWith('[') && line.endsWith(']') ) {
      if (!line.includes('|')) parseOpt.split = splitT;
      const tagArr = line.match(/\[.+?\]/g);
      const tagsIndex = tagArr!.indexOf('[TAGS]');
      tagsIndex >= 0 && tagArr!.splice(tagsIndex, 1, '[TAG1]', '[TAG2]');
      tagArr!.forEach(tag => {
        (parseOpt.columns as Column[]).push(columnsMap[tag]);
      })
      return true;
    }
    return false;
  })
  return parseOpt;
}

const getParseOptions = (alignType: AlignType, headLines: string[]): ParserOpt => {
  switch (alignType) {
    case AlignType.UNKNOWN:
      return null
    case AlignType.STANDARD:
    case AlignType.BLAST:
    case AlignType.MINIMAP:
    case AlignType.NUCMER_B:
      return {
        split: characteristics[alignType].all!.split!,
        columns: characteristics[alignType].all!.columns!,
      }
    case AlignType.NUCMER:
    case AlignType.NUCMER_T:
      return calcNucmerParseOpt(headLines);
    default:
      return null;
  }
}

export default getParseOptions;
