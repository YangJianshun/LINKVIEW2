import checkType from '../src/checkType';
import parseAlignFile from '../src/parser';
import { parserCreater, filterCreater } from '../src/parser';
import path from 'path';
// import { AlignType } from '../src/@types/characteristics';

describe('parser test', () => {
  test('parser-standard test', async () => {
    const fileName = path.join(
      __dirname,
      './alignments/alignments.standard.tab'
    );
    const { alignType, parserOpt } = await checkType(fileName);
    const parser = parserCreater(parserOpt);
    const filter = filterCreater(parserOpt ? parserOpt.filters: null);
    const { alignments } = await parseAlignFile(fileName, parser, filter);
    // console.log(alignments);
    expect((alignments as any[]).length).toBe(10);
  });

  test('parser-nucmer test', async () => {
    const fileName = path.join(
      __dirname,
      './alignments/alignments.rclo.nucmer'
    );
    const { alignType, parserOpt } = await checkType(fileName);
    const parser = parserCreater(parserOpt);
    const filter = filterCreater(parserOpt ? parserOpt.filters: null);
    const { alignments } = await parseAlignFile(fileName, parser, filter);
    // console.log(alignments);
    expect((alignments as any[]).length).toBe(5);
  });

  test('parser-nucmerT test', async () => {
    const fileName = path.join(
      __dirname,
      './alignments/alignments.rclT.nucmer'
    );
    const { alignType, parserOpt } = await checkType(fileName);
    const parser = parserCreater(parserOpt);
    const filter = filterCreater(parserOpt ? parserOpt.filters: null);
    const { alignments } = await parseAlignFile(fileName, parser, filter);
    // console.log(alignments);
    expect((alignments as any[]).length).toBe(6);
  });

  test('parser-nucmerB test', async () => {
    const fileName = path.join(
      __dirname,
      './alignments/alignments.Br.nucmer'
    );
    const { alignType, parserOpt } = await checkType(fileName);
    const parser = parserCreater(parserOpt);
    const filter = filterCreater(parserOpt ? parserOpt.filters: null);
    const { alignments } = await parseAlignFile(fileName, parser, filter);
    // console.log(alignments);
    expect((alignments as any[]).length).toBe(10);
  });

  test('parser-minimap test', async () => {
    const fileName = path.join(
      __dirname,
      './alignments/alignments.minimap2'
    );
    const { alignType, parserOpt } = await checkType(fileName);
    const parser = parserCreater(parserOpt);
    const filter = filterCreater(parserOpt ? parserOpt.filters: null);
    const { alignments } = await parseAlignFile(fileName, parser, filter);
    // console.log(alignments);
    expect((alignments as any[]).length).toBe(10);
  });

  test('parser-blast test', async () => {
    const fileName = path.join(
      __dirname,
      './alignments/alignments.blastn'
    );
    const { alignType, parserOpt } = await checkType(fileName);
    const parser = parserCreater(parserOpt);
    const filter = filterCreater(parserOpt ? parserOpt.filters: null);
    const { alignments } = await parseAlignFile(fileName, parser, filter);
    // console.log(alignments);
    expect((alignments as any[]).length).toBe(5);
  });
  
});
