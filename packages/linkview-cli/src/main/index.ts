#! /usr/bin/env node

import alignParser, {
  AlignType,
  calculateSubAlign,
} from '@linkview/linkview-align-parser';

import paramsParser from './paramsParser';
import { paramsCreater, layoutCreater, svgCreater } from '@linkview/linkview-core';

export default function main() {
  const options = paramsParser();

  options.use(function (this: typeof options) {
    console.log(this)
  })

  // 根据 parameter 文件，确定每行的作图参数
  options.use(paramsCreater);
  console.log('1~~');
  // 根据 karyotype 文件，生成绘图的布局，若没有 karyotype 文件则返回空的绘图布局
  options.use(layoutCreater);
  console.log('2~~');
  // 解析 alignments，并推断没有写明 start 和 end 的 ctg
  // options.use(alignParser);
  // 生成 svg
  options.use(svgCreater);
  console.log('3~~');
}
