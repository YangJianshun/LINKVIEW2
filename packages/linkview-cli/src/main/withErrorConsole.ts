import chalk from "chalk"

export function withErrorConsole(fn: (...args: any) => any) {
  return function (...args: any) {
    try {
      fn(...args)
    } catch(error) {
      if (error instanceof Error) {
        error = error.message.replace(/^Error: /, '');
      }
      console.log(chalk.red(`error: ${error}`))
    }
  }
}