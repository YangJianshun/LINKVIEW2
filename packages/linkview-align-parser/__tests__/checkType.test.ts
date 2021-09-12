import checkType from '../src/checkType';
import path from 'path';
import { AlignType } from '../src/@types/characteristics';

describe('checkType test', () => {
  test('checkType: File not exist', () => {
    expect(() => checkType('/path/not/exist')).toThrow(
      'does not exist, please check!'
    );
  });

  test('checkType: strand format', async () => {
    const res = await checkType(
      path.join(__dirname, './alignments/alignments.standard.tab')
    );
    expect(res.alignType).toBe(AlignType.STANDARD);
    expect(res).toEqual({
      alignType: AlignType.STANDARD,
      parserOpt: {
        split: /\s+/,
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
    });
  });

  test('checkType: blast format', async () => {
    const res = await checkType(
      path.join(__dirname, './alignments/alignments.blastn')
    );
    expect(res.alignType).toBe(AlignType.BLAST);
    expect(res.parserOpt).toEqual({
      split: '\t',
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
    });
  });

  test('checkType: NUCMER format', async () => {
    const res = await checkType(
      path.join(__dirname, './alignments/alignments.rcl.nucmer')
    );
    expect(res.alignType).toBe(AlignType.NUCMER);
  });

  test('checkType: NUCMER_T format', async () => {
    const res = await checkType(
      path.join(__dirname, './alignments/alignments.rclT.nucmer')
    );
    expect(res.alignType).toBe(AlignType.NUCMER_T);
    expect(res).toEqual({
      alignType: AlignType.NUCMER_T,
      parserOpt: {
        split: /\s+/,
        filters: [
          { startsWith: 'NUCMER', endsWith: 'NUCMER' },
          { startsWith: '/' },
          { startsWith: '[', endsWith: ']' },
          { startsWith: '=', endsWith: '=' },
        ],
        columns: [
          'start1',
          'end1',
          'start2',
          'end2',
          'alignLen',
          'alignLen',
          'identity',
          'len1',
          'len2',
          'otherNumber',
          'otherNumber',
          'ctg1',
          'ctg2',
        ],
      },
    });
  });

  test('checkType: NUCMER_B format', async () => {
    const res = await checkType(
      path.join(__dirname, './alignments/alignments.Br.nucmer')
    );
    expect(res.alignType).toBe(AlignType.NUCMER_B);
  });

  test('checkType: NUCMER format', async () => {
    const res = await checkType(
      path.join(__dirname, './alignments/alignments.rclo.nucmer')
    );
    expect(res.alignType).toBe(AlignType.NUCMER);
  });

  test('checkType: NUCMER format', async () => {
    const res = await checkType(
      path.join(__dirname, './alignments/alignments.rl.nucmer')
    );
    expect(res.alignType).toBe(AlignType.NUCMER);
  });

  test('checkType: NUCMER format', async () => {
    const res = await checkType(
      path.join(__dirname, './alignments/alignments.r.nucmer')
    );
    expect(res.alignType).toBe(AlignType.NUCMER);
    expect(res).toEqual({
      alignType: AlignType.NUCMER,
      parserOpt: {
        split: /\s+\|\s+|\s+/,
        filters: [
          { startsWith: 'NUCMER', endsWith: 'NUCMER' },
          { startsWith: '/' },
          { startsWith: '[', endsWith: ']' },
          { startsWith: '=', endsWith: '=' },
        ],
        columns: [
          'start1',
          'end1',
          'start2',
          'end2',
          'alignLen',
          'alignLen',
          'identity',
          'ctg1',
          'ctg2',
        ],
      },
    });
  });

  test('checkType: UNKNOWN format', async () => {
    const res = await checkType(
      path.join(__dirname, './alignments/alignments.unknown')
    );
    expect(res.alignType).toBe(AlignType.UNKNOWN);
  });

  test('checkType: minimap format', async () => {
    const res = await checkType(
      path.join(__dirname, './alignments/alignments.minimap2')
    );
    expect(res.alignType).toBe(AlignType.MINIMAP);
    expect(res.parserOpt).toEqual({
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
    });
  });
});
