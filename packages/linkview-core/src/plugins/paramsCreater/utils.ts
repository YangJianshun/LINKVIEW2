import fs from 'fs';

export function toArray(val: any | any[]) {
  if (val instanceof Array) {
    return val;
  } else if (val.length && !(typeof val === 'string')) {
    return Array.from(val);
  } else {
    return [val];
  }
}

export function parseParamInt(val: string, param: string) {
  const result = parseInt(String(Number(val)));
  if (isNaN(result))
    throw new Error(
      `Illegal argument of option '${param}', ${val} is not an integer`
    );
  return result;
}

export function parseParamFloat(val: string, param: string) {
  const result = Number(val);
  if (isNaN(result))
    throw new Error(
      `Illegal argument of option '${param}', ${val} is not a number`
    );
  return result;
}

export function parseParamFiles(
  fileNames: string | string[],
  allowMultiple: boolean = true,
  errInfo: string
) {
  fileNames = toArray(fileNames);
  if (allowMultiple) {
    for (let index = 0, len = fileNames.length; index < len; index++) {
      const fileName = fileNames[index];
      const splitInputs = fileName.split(',');
      fileNames.splice(index, 1, ...splitInputs);
      index += splitInputs.length - 1;
    }
  }
  for (let fileName of fileNames) {
    if (!fs.existsSync(fileName)) {
      throw new Error(`${errInfo}, ${fileName} not exist!`);
    }
  }
  return fileNames;
}

export function parseParamSingleFile(fileName: string, param: string) {
  return parseParamFiles(
    fileName,
    false,
    `Illegal argument of option '${param}'`
  )[0];
}

export function parseParamMultipleFile(fileNames: string | string[], param: string) {
  return parseParamFiles(
    fileNames,
    true,
    `Illegal argument of option '${param}'`
  );
}

export function parseParamInput(fileNames: string | string[]) {
  return parseParamFiles(fileNames, true, `Illegal argument`);
}

export function parseParamWithLimit(limits: string[]) {
  return function (val: string, param: string) {
    val = val.toLowerCase();
    if (!limits.includes(val)) {
      throw new Error(
        `Illegal argument of option '${param}', Expected ${limits.join(' | ')}, but received '${val}'`
      );
    }
    return val;
  }
}

export function parseBases(val: string) {
  const suffixMap = {
    'm': 1000000,
    'mb': 1000000,
    'mbp': 1000000,
    'k': 1000,
    'kb': 1000,
    'kbp': 1000,
    'bp': 1,
  }
  val = val.trim().toLowerCase();
  let result = Number(val);
  for (let suffix in suffixMap) {
    if (val.endsWith(suffix)) {
      val = val.replace(suffix, '');
      result = Number(val) * suffixMap[suffix as keyof typeof suffixMap];
      break;
    }
  }
  return result;
}

export function parseParamAxisUnit(val: string, param: string): number | 'auto' {
  val = val.toString();
  val = val.trim().toLowerCase();
  const result = val === 'auto' ? val : parseBases(val);
  if (result !== 'auto' && isNaN(result))
    throw new Error(
      `Illegal argument of option '${param}', '${val}' cannot be resolved to number of bases!`
    );
  return result;
}

export const parseParamLabelPos = parseParamWithLimit(['left', 'center', 'right'])
export const parseParamAlign = parseParamWithLimit(['left', 'center', 'right'])
export const parseParamStyle = parseParamWithLimit(['classic', 'simple'])
export const parseParamAxisPos = parseParamWithLimit(['top', 'bottom'])