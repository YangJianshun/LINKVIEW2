import checkType from '../src/checkType';
import path from 'path';

describe('checkType test', () => {
  test('checkType: File not exist', () => {
    expect(() => checkType('/path/not/exist')).toThrow(
      'does not exist, please check!'
    );
  });

  test('checkType: strand format', async () => {
    // const res = await checkType(path.join(__dirname, './alignments/alignments.blastn'));
    // expect(res).toBe('done');
  });

});
