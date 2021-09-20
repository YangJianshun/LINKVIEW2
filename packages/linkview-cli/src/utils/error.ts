import chalk from "chalk"

export function withErrorConsole(fn: (...args: any) => any) {
  return function (...args: any) {
    try {
      fn(...args)
    } catch(error) {
      if (error instanceof Error) {
        error = error.message.replace(/^Error: /, '');
      }
      console.log(`error: ${error}`)
    }
  }
}

export function errorPos(str: string, errorStr: string) {
  const position = str.indexOf(errorStr);
  str = str.replace(errorStr, chalk.bgYellow.red(errorStr))
  return `\t${str}\n\t${' '.repeat(position)}${chalk.yellow('^')}`;
}

export function warn(info: string) {
  console.log(`warn: ${info}`);
}