import characteristics from './characteristics';
import { AlignType, numberColumsSet, strandFlags } from './constants';
import { isNumber } from '../utils/number';
import { allTrue } from '../utils/array';

export function checkLine(
  line: string,
  lineCharacteristic: LineCharacteristic
): boolean {
  const { split, columns, columnCount } = lineCharacteristic;
  const lineMatchConditions: boolean[] = [];
  if (split) {
    line = line.trim();
    const items = line.split(split);
    columnCount &&
      (columnCount instanceof Array
        ? lineMatchConditions.push(columnCount.includes(items.length))
        : lineMatchConditions.push(items.length === columnCount));
    console.log(items.length, columnCount, lineMatchConditions);
    console.log(items);
    if (columns) {
      for (let index in columns) {
        const item = items[index];
        const colum = columns[index];

        strandFlags[colum] &&
          lineMatchConditions.push(strandFlags[colum]!.includes(item));

        if (!numberColumsSet.has(colum)) continue;
        lineMatchConditions.push(isNumber(item));
      }
    }
    console.log(lineMatchConditions, allTrue(lineMatchConditions));
    return allTrue(lineMatchConditions);
  }
  return false;
}

export default function checkTypeByHeadLines(headLines: string[]) {
  for (let alignType in characteristics) {
    const characteristic = characteristics[alignType];
    const matchConditions: boolean[] = [];
    if (characteristic.all) {
      headLines.forEach((line) => {
        matchConditions.push(checkLine(line, characteristic.all!));
      });
    } else {
    }
  }
}

// const headLines = [
//   'ctg2	Sep 04 2021	14510784	NUCMER	/path/to/ctg1.fa	ctg1	7636865	7638890	312202	314269	90.199814	90.199814	2026	0	0	NULL	0	Plus	18585056	0	0',
// ];

// for (let line of headLines) {
//   let res = checkLine(line, characteristics[AlignType.NUCMER_B].all!);
//   console.log(line);
//   console.log(res);
// }
