import { Options } from '../@types/options';
import {paramsCreater, layoutCreater, alignCreater, svgCreater} from '../plugins';

export default async function main(options: Options) {
  // 根据 parameter 文件，确定每行的作图参数
  options.use(paramsCreater);
  // 根据 karyotype 文件，生成绘图的布局，若没有 karyotype 文件则返回空的绘图布局
  options.use(layoutCreater);
  // 解析 alignments，并推断没有写明 start 和 end 的 ctg, 注意这个是异步操作
  await options.use<typeof options>(alignCreater);
  // 生成 svg
  options.use(svgCreater);
  return options.svg;
}