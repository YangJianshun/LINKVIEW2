#! /usr/bin/env node

import alignParser, {
  AlignType,
  calculateSubAlign,
} from '@linkview/linkview-align-parser';

import paramsParser from './paramsParser';

export * from './withErrorConsole';

export default function main() {
  const options = paramsParser();
  console.log(options);
}
