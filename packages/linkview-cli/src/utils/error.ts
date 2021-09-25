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

// 如果传了 subStr，必须从 subStr 里面找，
// 比如 'align_left=true gap_length=true' 里面找 true，指定 subStr 是 'gap_length=true' 的话，只找到第二个
export function errorPos(str: string, errorStr: string, subStr? :string) {
  let baseIndex = 0;
  let searchStr = str;
  if (subStr) {
    baseIndex = str.indexOf(subStr);
    searchStr = subStr
  }
  const position = searchStr.indexOf(errorStr) + baseIndex;
  const errorStrLen = errorStr.length;
  str = str.slice(0, position) + chalk.bgYellow.red(errorStr) + str.slice(position + errorStrLen)
  return `${str}\n${' '.repeat(position)}${chalk.yellow('^')}`;
}

export function warn(info: string) {
  console.log(`warn: ${info}`);
}