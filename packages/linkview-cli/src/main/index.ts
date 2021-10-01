#! /usr/bin/env node

import paramsParser from './paramsParser';
import { paramsCreater, layoutCreater, svgCreater, alignCreater } from '@linkview/linkview-core';

export default async function main() {
  const options = paramsParser();

  options.use(function (this: typeof options) {
    console.log(this)
  })

  // 根据 parameter 文件，确定每行的作图参数
  options.use(paramsCreater);
  // 根据 karyotype 文件，生成绘图的布局，若没有 karyotype 文件则返回空的绘图布局
  options.use(layoutCreater);
  // 解析 alignments，并推断没有写明 start 和 end 的 ctg, 注意这个是异步操作
  await options.use<typeof options>(alignCreater);
  // 生成 svg
  options.use(svgCreater);
}
