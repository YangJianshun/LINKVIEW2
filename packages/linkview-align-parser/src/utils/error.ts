import chalk from "chalk"

export function withErrorConsole(fn: (...args: any) => any) {
  return function (...args: any) {
    try {
      return fn(...args);
    } catch(error) {
      if (error instanceof Error) {
        error = error.message.replace(/^Error: /, '');
      }
      console.log(`error: ${error}`);
      process.exit();
    }
  }
}

export function errorPos(str: string, items: string[], index: number | string) {
  index = Number(index);
  const errorStr = items[index];
  let baseIndex = 0;
  let position = -1;
  for (let i = 0, len = items.length; i < len; i++ ) {
    if (i !== index && items[i] === errorStr) {
      baseIndex = str.indexOf(errorStr, baseIndex) + 1;
    }
    if (i === index) {
      position = str.indexOf(errorStr, baseIndex);
      break;
    }
  }

  // const position = str.indexOf(errorStr);
  const errorStrLen = errorStr.length;
  const mark = `${chalk.bgYellow('|')} `
  str = str.slice(0, position) + chalk.bgYellow.red(errorStr) + str.slice(position + errorStrLen)
  return `${mark}${str}\n${mark}${' '.repeat(position)}${chalk.yellow('^')}`;
}

export function warn(info: string) {
  console.log(`warn: ${info}`);
}
