#! /usr/bin/env node

import alignParser, {
  AlignType,
  calculateSubAlign,
} from '@linkview/linkview-align-parser';

import paramsParser from './paramsParser';
import layoutCreater from '../plugins/layoutCreater';

export * from '../utils/error';

export default function main() {
  const options = paramsParser();
  options.use(function (this: typeof options) {
    console.log(this)
  })
  // 根据 karyotype 文件，生成绘图的布局，若没有 karyotype 文件则返回空的绘图布局
  options.use(layoutCreater);
  console.log(options.layout)
}
