import eachLine from '../utils/eachLine';
import { Alignment, AlignmentsByCtgs } from '../@types/alignment';
import { DEFAULT_COLOR_FLAG, DEFAULT_OPACITY_FLAG } from './constants';
import { ParserOpt } from '../@types/parser';
import { LineCharacteristic } from '../@types/characteristics';
import { isNumber } from '../utils/number';
import { average } from '../utils/array';
import { checkLine } from '../checkType/checkTypeByHeadLines';
import { errorPos } from '../utils/error';

// 根据 parserOpt，生成一个解析函数，把每一行解析成固定的格式
export const parserCreater =
  (parserOpt: ParserOpt, fileName: string) => (line: string) => {
    line = line.trim();
    if (!parserOpt) return null;
    const { split, columns } = parserOpt;
    const items = line.split(split);
    const alignment: Alignment = {
      ctg1: '',
      start1: 0,
      end1: 0,
      ctg2: '',
      start2: 0,
      end2: 0,
      alignLen: 0,
      color: DEFAULT_COLOR_FLAG,
      opacity: DEFAULT_OPACITY_FLAG,
    };
    const alignLens: number[] = []; // 用于计算 alignLen 平均值， 如果一行有多个 alignLen
    let shouldReverse: boolean = false; // 是否需要交换 start1 和 end1 的值，minimap strand 为 -，需要交换
    for (const index in parserOpt.columns) {
      const colum = columns[index];
      const value = items[index];
      if (['ctg1', 'ctg2'].includes(colum)) {
        alignment[colum as 'ctg1' | 'ctg2'] = value;
      } else if (
        [
          'start1',
          'end1',
          'start2',
          'end2',
          'identity',
          'evalue',
          'bitScore',
          'len1',
          'len2',
        ].includes(colum)
      ) {
        if (!isNumber(value)) {
          const errorInfo = errorPos(line, items, index);
          throw new Error(
            `${colum} should be a number, but get '${value}' in '${fileName}': \n${errorInfo} \n`
          );
        }
        alignment[
          colum as
            | 'start1'
            | 'end1'
            | 'start2'
            | 'end2'
            | 'identity'
            | 'evalue'
            | 'bitScore'
        ] = Number(value);
      } else if (colum === 'alignLen') {
        isNumber(value) && alignLens.push(Number(value));
      } else if (colum === 'color:opacity' && value) {
        const [color, opacity] = value.split(':');
        alignment.color = color;
        alignment.opacity = isNumber(opacity) ? Number(opacity) : 1;
        // 如果 minimap， strand 为 ‘-’，需要把 start1 和 end1 交换位置
      } else if (colum === 'minimapStrand' && value === '-') {
        shouldReverse = true;
      }
    }
    if (shouldReverse) {
      const { start1, end1 } = alignment;
      [alignment.start1, alignment.end1] = [end1, start1];
    }
    if (alignLens.length > 0) alignment.alignLen = average(alignLens);
    if (alignment.alignLen === 0) {
      const { start1, end1, start2, end2 } = alignment;
      alignment.alignLen =
        (Math.abs(start1 - end1) + 1 + Math.abs(start2 - end2) + 1) / 2;
    }
    // console.log(alignment);
    return alignment;
  };

// 常规过滤，比如注释行, NUCMER 开头的行等
// 根据 parserOpt.filters 生成一个过滤函数，用于 eachLine 过滤
export const filterCreater =
  (parserOptFilters: LineCharacteristic[] | null | undefined) =>
  (line: string) => {
    line = line.trim();
    let filterCondition = line === '' || line.startsWith('#');
    if (parserOptFilters)
      filterCondition =
        filterCondition ||
        parserOptFilters.findIndex((lineCharacteristic) =>
          checkLine(line, lineCharacteristic)
        ) >= 0;
    return filterCondition;
  };

const parseAlignFile = (
  fileName: string,
  parser: ReturnType<typeof parserCreater>,
  filter: ReturnType<typeof filterCreater>,
  filterAlign: ((alignment: Alignment) => boolean) | null = null
) => {
  const alignments: Alignment[] = [];
  const alignmentsByCtgs: AlignmentsByCtgs = {};
  const lenInfo: { [ctg: string]: number } = {};
  return eachLine(
    fileName,
    (line) => {
      // 获取每一行的解析结果
      const alignment = parser(line);
      // 获取 ctg 长度信息
      if (alignment) {
        const { len1, len2, ctg1, ctg2 } = alignment;
        if (len1) lenInfo[ctg1] = len1;
        if (len2) lenInfo[ctg2] = len2;
        delete alignment.len1;
        delete alignment.len2;

        // 存储 alignment，分别存到 alignmentsByCtgs 和 alignments 中
        if (!(ctg1 in alignmentsByCtgs)) alignmentsByCtgs[ctg1] = {};
        if (!(ctg2 in alignmentsByCtgs[ctg1]))
          alignmentsByCtgs[ctg1][ctg2] = [];
        if (!(ctg2 in alignmentsByCtgs)) alignmentsByCtgs[ctg2] = {};
        if (!(ctg1 in alignmentsByCtgs[ctg2]))
          alignmentsByCtgs[ctg2][ctg1] = [];

        alignment && // 这个 alignment 不为 null
          (filterAlign ? !filterAlign(alignment) : true) && // 这个 alignment 不被过滤
          alignments.push(alignment) &&
          alignmentsByCtgs[ctg1][ctg2].push(alignment) &&
          alignmentsByCtgs[ctg2][ctg1].push(alignment);
      }

      // 返回 true 就是一直读下去
      return true;
    },
    filter
  ).then(() => {
    // 读完了
    return { alignments, alignmentsByCtgs, lenInfo };
  });
};

export const parseAlignFromContent = (
  content: string,
  parser: ReturnType<typeof parserCreater>,
  filter: ReturnType<typeof filterCreater>,
  filterAlign: ((alignment: Alignment) => boolean) | null = null
) => {
  const alignments: Alignment[] = [];
  const alignmentsByCtgs: AlignmentsByCtgs = {};
  const lenInfo: { [ctg: string]: number } = {};

  const lines = content.trim().split('\n');
  lines.forEach((line) => {
    // 获取每一行的解析结果
    if (filter(line)) return;
    const alignment = parser(line);
    // 获取 ctg 长度信息
    if (alignment) {
      const { len1, len2, ctg1, ctg2 } = alignment;
      if (len1) lenInfo[ctg1] = len1;
      if (len2) lenInfo[ctg2] = len2;
      delete alignment.len1;
      delete alignment.len2;

      // 存储 alignment，分别存到 alignmentsByCtgs 和 alignments 中
      if (!(ctg1 in alignmentsByCtgs)) alignmentsByCtgs[ctg1] = {};
      if (!(ctg2 in alignmentsByCtgs[ctg1]))
        alignmentsByCtgs[ctg1][ctg2] = [];
      if (!(ctg2 in alignmentsByCtgs)) alignmentsByCtgs[ctg2] = {};
      if (!(ctg1 in alignmentsByCtgs[ctg2]))
        alignmentsByCtgs[ctg2][ctg1] = [];

      alignment && // 这个 alignment 不为 null
        (filterAlign ? !filterAlign(alignment) : true) && // 这个 alignment 不被过滤
        alignments.push(alignment) &&
        alignmentsByCtgs[ctg1][ctg2].push(alignment) &&
        alignmentsByCtgs[ctg2][ctg1].push(alignment);
    }
  });

  
  return { alignments, alignmentsByCtgs, lenInfo };
};

export default parseAlignFile;
export * from './constants';

// ===== test =====
// const parserOpt = {
//   split: /\s+/,
//   columns: [
//     'ctg1',
//     'start1',
//     'end1',
//     'ctg2',
//     'start2',
//     'end2',
//     'color:opacity',
//   ],
// } as ParserOpt;

// const parserOptNucmer = {
//   split: /\s+\|\s+|\s+/,
//   filters: [
//     { startsWith: 'NUCMER', endsWith: 'NUCMER' },
//     { startsWith: '/' },
//     { startsWith: '[', endsWith: ']' },
//     { startsWith: '=', endsWith: '=' },
//   ],
//   columns: [
//     'start1',
//     'end1',
//     'start2',
//     'end2',
//     'alignLen',
//     'alignLen',
//     'identity',
//     'ctg1',
//     'ctg2',
//   ],
// } as ParserOpt;

// const parserOptBlast = {
//   split: '\t',
//   columns: [
//     'ctg1',
//     'ctg2',
//     'identity',
//     'alignLen',
//     'otherNumber',
//     'otherNumber',
//     'start1',
//     'end1',
//     'start2',
//     'end2',
//     'evalue',
//     'bitScore',
//   ],
// } as ParserOpt;

// const parserOptMinimap = {
//   split: '\t',
//   columns: [
//     'ctg1',
//     'len1',
//     'start1',
//     'end1',
//     'minimapStrand',
//     'ctg2',
//     'len2',
//     'start2',
//     'end2',
//     'alignLen',
//   ],
// } as ParserOpt;

// const line1 = 'ctg1	792070	793022	ctg2	1396663	1395741';
// const line2 = 'ctg1	792070	793022	ctg2	1396663	1395741	red';
// const line3 = 'ctg1	792070	793022	ctg2	1396663	1395741	red:0.5';
// const line4 =
//   '  312202   314269  |  7636865  7638890  |     2068     2026  |    90.20  | ctg1	ctg2';
// const line5 = 'ctg2	ctg1	99.10	5250	25	12	9256	14492	8053	13293	0.0	1.395e+05';
// const line6 =
//   'ctg1	78060761	47739181	47898878	+	ctg2	64984695	44048303	44206874	145237	160811	60	tp:A:P	cm:i:14297	s1:i:144549	s2:i:2367	dv:f:0.0045';
// const line7 =
//   'ctg1	78060761	56679579	56924210	-	ctg2	64984695	42479076	42722952	218588	245765	60	tp:A:P	cm:i:21472	s1:i:217985	s2:i:3364	dv:f:0.0058';

// const parser = parserCreater(parserOpt);
// const parserNucmer = parserCreater(parserOptNucmer);
// const parserBlast = parserCreater(parserOptBlast);
// const parserMinimap = parserCreater(parserOptMinimap);

// parser(line1);
// parser(line2);
// parser(line3);
// parserNucmer(line4);
// parserBlast(line5);
// parserMinimap(line6);
// parserMinimap(line7);

// const filterNucmer = filterCreater(parserOptNucmer!.filters!);
// const filterBlast = filterCreater(parserOptBlast!.filters!);
// const filterMinimap = filterCreater(parserOptMinimap!.filters!);
// parseAlignFile(
//   '../../__tests__/alignments/alignments.r.nucmer',
//   parserNucmer,
//   filterNucmer
// ).then((alignments) => console.log(alignments));

// parseAlignFile(
//   '../../__tests__/alignments/alignments.blastn',
//   parserBlast,
//   filterBlast
// ).then((alignments) => console.log(alignments));

// parseAlignFile(
//   '../../__tests__/alignments/alignments.minimap2',
//   parserMinimap,
//   filterMinimap,
// ).then((alignments) => console.log(alignments));
