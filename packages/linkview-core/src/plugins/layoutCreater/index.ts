import fs from 'fs';
import { Options } from '../../@types/options';
import { Layout } from '../../@types/layout';
import { errorPos } from '../../utils/error';

export default function layoutCreater(this: Options) {
  const options = this;
  const layout: Layout = [];
  const { karyotype } = options;
  if (karyotype) {
    const karyotypeContent = fs.readFileSync(karyotype).toString().trim();
    const lines = karyotypeContent.split('\n');
    for (let index = 0, lineCount = lines.length; index < lineCount; index++) {
      const line = lines[index].trim();
      const items = line.split(/\s+/);
      layout.push([])
      for (let item of items) {
        const leftDash = item.startsWith('-');
        const rightDash = item.endsWith('-');
        item = item.replace(/^-*/, '').replace(/-*$/, '');
        const [ctg, startStr, endStr] = item.split(':');
        const noIntervalInfo =  startStr === undefined && endStr === undefined
        const start = noIntervalInfo ? 0 : Number(startStr);
        const end = noIntervalInfo ? 0 : Number(endStr);
        if (isNaN(start) || isNaN(end)) {
          const errStr = isNaN(start) ? startStr : endStr;
          const errorPosInfo = errorPos(line, errStr, item);
          throw new Error(`format error at karyotype file '${karyotype}' line ${index + 1}\n${errorPosInfo}\n'${errStr}' is not a number!`);
        }
        layout[index].push({ctg, start, end, leftDash, rightDash})
      }
    }
  }
  options.layout = layout;
  return options;
}
