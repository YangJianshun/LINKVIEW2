import { AlignType } from '../src/@types/characteristics';

import characteristics from '../src/checkType/characteristics';
import { checkLine } from '../src/checkType/checkTypeByHeadLines';

describe('standard alignments 每行合法性校验 单元测试', () => {
  test('standard: 常规行', () => {
    const line = 'ctg1	312202	314269	ctg2	7636865	7638890	';
    expect(checkLine(line, characteristics[AlignType.STANDARD].all!)).toBe(
      true
    );
  });

  test('standard: 带有 color', () => {
    const line = 'ctg1	312202	314269	ctg2	7636865	7638890	red:0.5';
    expect(checkLine(line, characteristics[AlignType.STANDARD].all!)).toBe(
      true
    );
  });

  test('standard: contig 名为数字', () => {
    const line = '1	312202	314269	2	7636865	7638890';
    expect(checkLine(line, characteristics[AlignType.STANDARD].all!)).toBe(
      true
    );
  });

  test('standard: 错误行，顺序错误', () => {
    const line = '312202	314269 7636865	7638890	ctg1 ctg2';
    expect(checkLine(line, characteristics[AlignType.STANDARD].all!)).toBe(
      false
    );
  });

  test('standard: 错误行，缺失列', () => {
    const line = 'ctg1	312202	314269	ctg2	7636865	';
    expect(checkLine(line, characteristics[AlignType.STANDARD].all!)).toBe(
      false
    );
  });

  test('standard: 错误行，缺失列', () => {
    const line = 'ctg1	312202	ctg2	7636865	7638890';
    expect(checkLine(line, characteristics[AlignType.STANDARD].all!)).toBe(
      false
    );
  });

  test('standard: 实际上是另一种格式', () => {
    const line = 'ctg2	ctg1	99.10	5250	25	12	9256	14492	8053	13293	0.0	1.395e+05';
    expect(checkLine(line, characteristics[AlignType.STANDARD].all!)).toBe(
      false
    );
  });
});

describe('blastn alignments 每行合法性校验 单元测试', () => {
  test('blastn: 常规行', () => {
    const line =
      'ctg2\tctg1\t99.10\t5250\t25\t12\t9256\t14492\t8053\t13293\t0.0\t1.395e+05';
    expect(checkLine(line, characteristics[AlignType.BLAST].all!)).toBe(true);
  });

  test('blastn: contig 名为数字', () => {
    const line = '1	2	99.10	5250	25	12	9256	14492	8053	13293	0.0	5000';
    expect(checkLine(line, characteristics[AlignType.BLAST].all!)).toBe(true);
  });

  test('blastn: 错误行，缺失列', () => {
    const line = '1	2	99.10	5250	25	12	9256	14492	8053	13293	0.0	';
    expect(checkLine(line, characteristics[AlignType.BLAST].all!)).toBe(false);
  });

  test('blastn: 错误行，identity 不为数字', () => {
    const line = '1	2	百分之90	5250	25	12	9256	14492	8053	13293	0.0	1.395e+05';
    expect(checkLine(line, characteristics[AlignType.BLAST].all!)).toBe(false);
  });

  test('blastn: 错误行，实际上是另一种格式', () => {
    const line = 'ctg1	312202	314269	ctg2	7636865	7638890';
    expect(checkLine(line, characteristics[AlignType.BLAST].all!)).toBe(false);
  });
});

describe('minimap alignments 每行合法性校验 单元测试', () => {
  test('minimap: 常规行', () => {
    const line =
      'ctg1	78060761	56679579	56924210	-	ctg2	64984695	42479076	42722952	218588	245765	60	tp:A:P	cm:i:21472	s1:i:217985	s2:i:3364	dv:f:0.0058';
    expect(checkLine(line, characteristics[AlignType.MINIMAP].all!)).toBe(true);
  });

  test('minimap: contig 名为数字', () => {
    const line =
      '1	78060761	56679579	56924210	-	2	64984695	42479076	42722952	218588	245765	60	tp:A:P	cm:i:21472	s1:i:217985	s2:i:3364	dv:f:0.0058';
    expect(checkLine(line, characteristics[AlignType.MINIMAP].all!)).toBe(true);
  });

  test('minimap: 错误行，列缺失', () => {
    const line =
      'ctg1	56679579	56924210	-	ctg2	64984695	42479076	42722952	218588	245765	60	tp:A:P	cm:i:21472	s1:i:217985	s2:i:3364	dv:f:0.0058';
    expect(checkLine(line, characteristics[AlignType.MINIMAP].all!)).toBe(
      false
    );
  });

  test('minimap: 错误行，len2 不为数字', () => {
    const line =
      'ctg1	78060761 56679579	56924210	-	ctg2	len2	42479076	42722952	218588	245765	60	tp:A:P	cm:i:21472	s1:i:217985	s2:i:3364	dv:f:0.0058';
    expect(checkLine(line, characteristics[AlignType.MINIMAP].all!)).toBe(
      false
    );
  });

  test('minimap: 错误行，strand 不为 + 或 -', () => {
    const line =
      'ctg1	78060761	56679579	56924210	反向	ctg2	64984695	42479076	42722952	218588	245765	60	tp:A:P	cm:i:21472	s1:i:217985	s2:i:3364	dv:f:0.0058';
    expect(checkLine(line, characteristics[AlignType.MINIMAP].all!)).toBe(
      false
    );
  });
});

describe('minimap alignments 每行合法性校验 单元测试', () => {
  test('minimap: 常规行', () => {
    const line =
      'ctg1	78060761	56679579	56924210	-	ctg2	64984695	42479076	42722952	218588	245765	60	tp:A:P	cm:i:21472	s1:i:217985	s2:i:3364	dv:f:0.0058';
    expect(checkLine(line, characteristics[AlignType.MINIMAP].all!)).toBe(true);
  });

  test('minimap: contig 名为数字', () => {
    const line =
      '1	78060761	56679579	56924210	-	2	64984695	42479076	42722952	218588	245765	60	tp:A:P	cm:i:21472	s1:i:217985	s2:i:3364	dv:f:0.0058';
    expect(checkLine(line, characteristics[AlignType.MINIMAP].all!)).toBe(true);
  });

  test('minimap: 错误行，列缺失', () => {
    const line =
      'ctg1	56679579	56924210	-	ctg2	64984695	42479076	42722952	218588	245765	60	tp:A:P	cm:i:21472	s1:i:217985	s2:i:3364	dv:f:0.0058';
    expect(checkLine(line, characteristics[AlignType.MINIMAP].all!)).toBe(
      false
    );
  });

  test('minimap: 错误行，len2 不为数字', () => {
    const line =
      'ctg1	78060761 56679579	56924210	-	ctg2	len2	42479076	42722952	218588	245765	60	tp:A:P	cm:i:21472	s1:i:217985	s2:i:3364	dv:f:0.0058';
    expect(checkLine(line, characteristics[AlignType.MINIMAP].all!)).toBe(
      false
    );
  });

  test('minimap: 错误行，strand 不为 + 或 -', () => {
    const line =
      'ctg1	78060761	56679579	56924210	反向	ctg2	64984695	42479076	42722952	218588	245765	60	tp:A:P	cm:i:21472	s1:i:217985	s2:i:3364	dv:f:0.0058';
    expect(checkLine(line, characteristics[AlignType.MINIMAP].all!)).toBe(
      false
    );
  });
});

describe('NUCMER_B alignments 每行合法性校验 单元测试', () => {
  test('NUCMER_B: 常规行', () => {
    const line =
      'ctg2	Sep 04 2021	14510784	NUCMER	/path/to/ctg1.fa	ctg1	7636865	7638890	312202	314269	90.199814	90.199814	2026	0	0	NULL	0	Plus	18585056	0	0';
    expect(checkLine(line, characteristics[AlignType.NUCMER_B].all!)).toBe(
      true
    );
  });

  test('NUCMER_B: 错误行', () => {
    const line =
      'ctg2	Sep 04 2021	14510784	NUCMER	/path/to/ctg1.fa	ctg1	number	7638890	312202	314269	90.199814	90.199814	2026	0	0	NULL	0	Plus	18585056	0	0';
    expect(checkLine(line, characteristics[AlignType.NUCMER_B].all!)).toBe(
      false
    );
  });

  test('NUCMER_B: 错误行， strand 不为 Plus', () => {
    const line =
      'ctg2	Sep 04 2021	14510784	NUCMER	/path/to/ctg1.fa	ctg1	7636865	7638890	312202	314269	90.199814	90.199814	2026	0	0	NULL	0	+	18585056	0	0';
    expect(checkLine(line, characteristics[AlignType.NUCMER_B].all!)).toBe(
      false
    );
  });

  test('NUCMER_B: 错误行，格式错误', () => {
    const line =
      'ctg1	78060761	56679579	56924210	-	ctg2	64984695	42479076	42722952	218588	245765	60	tp:A:P	cm:i:21472	s1:i:217985	s2:i:3364	dv:f:0.0058';
    expect(checkLine(line, characteristics[AlignType.NUCMER_B].all!)).toBe(
      false
    );
  });
});

describe('others 单行校验', () => {
  test('startsWith', () => {
    const line = 'NUCMER';
    expect(
      checkLine(line, {
        startsWith: 'NUCMER',
      })
    ).toBe(true);
  });

  test('content', () => {
    const line =
      '    [S1]     [E1]  |     [S2]     [E2]  |  [LEN 1]  [LEN 2]  |  [% IDY]  |  [LEN R]  [LEN Q]  |  [COV R]  [COV Q]  | [TAGS]';
    expect(
      checkLine(line, {
        content: ['[S1]', '[TAGS]', '|'],
      })
    ).toBe(true);
  });

  test('content exclude', () => {
    const line =
      '    [S1]     [E1]  |     [S2]     [E2]  |  [LEN 1]  [LEN 2]  |  [% IDY]  |  [LEN R]  [LEN Q]  |  [COV R]  [COV Q]  | [TAGS]';
    expect(
      checkLine(line, {
        content: ['[S1]', '[TAGS]'],
        exclude: {
          content: '|',
        },
      })
    ).toBe(false);
  });

  test('content exclude', () => {
    const line =
      '[S1]	[E1]	[S2]	[E2]	[LEN 1]	[LEN 2]	[% IDY]	[LEN R]	[LEN Q]	[COV R]	[COV Q]	[TAGS]';
    expect(
      checkLine(line, {
        content: ['[S1]', '[TAGS]'],
        exclude: {
          content: '|',
        },
      })
    ).toBe(true);
  });
});
