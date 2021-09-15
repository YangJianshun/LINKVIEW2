import { AlignType, Characteristics } from '../@types/characteristics';
/**
 * 将各种 alignments 的格式特点抽象出来，用于自动判断格式类型
 * 注意：
 * 由于 blastn 可能会产生大量的 # 开头的注释行，LINKVIEW 专用的 alignment 格式也是允许 #开头的做为注释。
 * 所以判断的时候，取非 # 开头的前10行
 *
 * 1. STANDARD：
 *  按 空白 分割后，一共 6 列或者 7列，
 *  每列内容分别为 [ctg1, start1, start2, ctg2, start2, end2, color:opacity]
 *
 * 2. BLAST:
 *  按 tab 分割后，一共 12 列，
 *  每列内容分别为 [chro1, chro2, identity, alignLen, mismatches, gapOpens, start1, end1, start2, end2, evalue, bitScore]
 *
 * 3. MINIMAP
 *  按 tab 分割后，
 *  其中：
 *    1. ctg1
 *    2. len1
 *    3. start1
 *    4. end1
 *    5: '+' | '-'
 *    6: ctg2
 *    7. len2
 *    8. start2
 *    9. end2
 *    11. alignLen
 * 注意，如果 第五列 为 -, 请将 start2 和 end2 交换 (parser 中注意)
 *
 * 4. NUCMER
 * 有一行 trim 后，以 NUCMER 开头
 * 有一行 包含 '[S1]' '[TAGS]'，且包含 '|'
 * 按照 /\s+\|\s+|\s+/ 分割后，根据 包含 [S1] 的行，推测出 对应的模式 (parser 中注意)
 *
 * 5. NUCMER_T
 * 有一行 trim 后，以 NUCMER 开头
 * 有一行 包含 '[S1]' '[TAGS]', 且 不包含 '|'
 * 按照 空白 分割后，根据 包含 [S1] 的行，推测出 对应的模式
 *
 * 6. NUCMER_B
 * 按照 tab 分割后，一共 23 列:
 *  其中：
 *    1. ctg2
 *    5. len2
 *    6. 'NUCMER'
 *    8. ctg1
 *    9. start2
 *    10. end2
 *    11. start1
 *    12. end1
 *    13. identity
 *    14. identity
 *    15. alignLen
 *    20. 'Plus' | 'Minus'
 *    21. len1
 */

const characteristics: Characteristics = {
  [AlignType.STANDARD]: {
    all: {
      split: /\s+/,
      columnCount: [6, 7],
      columns: [
        'ctg1',
        'start1',
        'end1',
        'ctg2',
        'start2',
        'end2',
        'color:opacity',
      ],
    },
  },
  [AlignType.BLAST]: {
    all: {
      split: '\t',
      columnCount: 12,
      columns: [
        'ctg1',
        'ctg2',
        'identity',
        'alignLen',
        'otherNumber',
        'otherNumber',
        'start1',
        'end1',
        'start2',
        'end2',
        'evalue',
        'bitScore',
      ],
    },
  },
  [AlignType.MINIMAP]: {
    all: {
      split: '\t',
      columns: [
        'ctg1',
        'len1',
        'start1',
        'end1',
        'minimapStrand',
        'ctg2',
        'len2',
        'start2',
        'end2',
        'alignLen',
      ],
    },
  },
  [AlignType.NUCMER]: {
    include: [
      {
        startsWith: 'NUCMER',
      },
      {
        content: ['[S1]', '[TAGS]', '|'],
      },
    ],
  },
  [AlignType.NUCMER_T]: {
    include: [
      {
        startsWith: 'NUCMER',
      },
      {
        content: ['[S1]', '[TAGS]'],
        exclude: {
          content: '|',
        },
      },
    ],
  },
  [AlignType.NUCMER_B]: {
    all: {
      split: '\t',
      columnCount: 21,
      columns: {
        [0]: 'ctg2',
        [2]: 'len2',
        [3]: 'NUCMER',
        [5]: 'ctg1',
        [6]: 'start2',
        [7]: 'end2',
        [8]: 'start1',
        [9]: 'end1',
        [10]: 'identity',
        [11]: 'identity',
        [12]: 'alignLen',
        [17]: 'nucmerStrand',
        [18]: 'len1',
      },
    },
  },
  [AlignType.UNKNOWN]: {}
};

export default characteristics;
