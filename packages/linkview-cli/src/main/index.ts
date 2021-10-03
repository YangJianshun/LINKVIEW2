#! /usr/bin/env node

import paramsParser from './paramsParser';
import { main as core } from '@linkview/linkview-core';

export default async function main() {
  // 获取命令行参数
  const options = paramsParser();
  // 调用核心过程
  const svgContent = await core(options);
  console.log(svgContent);
}
