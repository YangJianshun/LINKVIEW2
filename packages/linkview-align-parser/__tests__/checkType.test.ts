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
    const res = await checkType(path.join(__dirname, './alignments/alignments.standard.tab'));
    expect(res).toBe(AlignType.STANDARD);
  });

  test('checkType: blast format', async () => {
    const res = await checkType(path.join(__dirname, './alignments/alignments.blastn'));
    expect(res).toBe(AlignType.BLAST);
  });

  test('checkType: NUCMER format', async () => {
    const res = await checkType(path.join(__dirname, './alignments/alignments.rcl.nucmer'));
    expect(res).toBe(AlignType.NUCMER);
  });

  test('checkType: NUCMER_T format', async () => {
    const res = await checkType(path.join(__dirname, './alignments/alignments.rclT.nucmer'));
    expect(res).toBe(AlignType.NUCMER_T);
  });

  test('checkType: NUCMER_B format', async () => {
    const res = await checkType(path.join(__dirname, './alignments/alignments.Br.nucmer'));
    expect(res).toBe(AlignType.NUCMER_B);
  });

  test('checkType: NUCMER format', async () => {
    const res = await checkType(path.join(__dirname, './alignments/alignments.rclo.nucmer'));
    expect(res).toBe(AlignType.NUCMER);
  });

  test('checkType: UNKNOWN format', async () => {
    const res = await checkType(path.join(__dirname, './alignments/alignments.unknown'));
    expect(res).toBe(AlignType.UNKNOWN);
  });
});
