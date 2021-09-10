import characteristics from './characteristics';
import { numberColumnsSet, strandFlags } from './constants';
import { isNumber } from '../utils/number';
import { allTrue } from '../utils/array';
import { AlignType, LineCharacteristic } from '../@types/characteristics';


export function checkLine(
  line: string,
  lineCharacteristic: LineCharacteristic
): boolean {
  const { split, columns, columnCount, startsWith, endsWith, content, exclude } = lineCharacteristic;
  const lineMatchConditions: boolean[] = [];
  if (split) {
    line = line.trim();
    const items = line.split(split);
    columnCount &&
      (columnCount instanceof Array
        ? lineMatchConditions.push(columnCount.includes(items.length))
        : lineMatchConditions.push(items.length === columnCount));
    if (columns) {
      for (let index in columns) {
        const item = items[index];
        const column = columns[index];

        strandFlags[column] &&
          lineMatchConditions.push(strandFlags[column]!.includes(item));

        if (!numberColumnsSet.has(column)) continue;
        lineMatchConditions.push(isNumber(item));
      }
    }
  }
  if (startsWith) {
    lineMatchConditions.push(line.startsWith(startsWith));
  }
  if (endsWith) {
    lineMatchConditions.push(line.endsWith(endsWith));
  }
  if (content) {
    Array.from(content).forEach(contentString => {
      lineMatchConditions.push(line.indexOf(contentString) >= 0);
    })
  }
  if (exclude) {
    const lineCharacteristicExclude = exclude
    lineMatchConditions.push(!checkLine(line, lineCharacteristicExclude));
  }
  return allTrue(lineMatchConditions);
}

export default function checkTypeByHeadLines(headLines: string[]) {
  for (const alignType in characteristics) {
    if (alignType === AlignType.UNKNOWN) continue
    const characteristic = characteristics[alignType as AlignType];
    const matchConditions: boolean[] = [];
    if (characteristic.all) {
      headLines.forEach((line) => {
        matchConditions.push(checkLine(line, characteristic.all!));
      });
    }
    if (characteristic.include) {
      characteristic.include.forEach( lineCharacteristic => {
        const matchCondition = headLines.findIndex(line => checkLine(line, lineCharacteristic)) > 0
        matchConditions.push(matchCondition);
      })
    }
    if (allTrue(matchConditions)) {
      return alignType as AlignType;
    }

  }
  return AlignType.UNKNOWN;
}

