import { Options } from '../@types/options';
import {
  paramsCreater,
  layoutCreater,
  alignCreater,
  svgCreater,
  autoLayoutCreater,
} from '../plugins';

export default async function main(options: Options) {
  // 根据 parameter 文件，确定每行的作图参数
  options.use(paramsCreater);
  // 根据 karyotype 文件，生成绘图的布局，若没有 karyotype 文件则返回空的绘图布局
  options.use(layoutCreater);
  // 解析 alignments，并推断没有写明 start 和 end 的 ctg, 注意这个是异步操作
  await options.use<typeof options>(alignCreater);
  // 如果没有 指定 karyotype 则根据 alignment 情况，推断出一个 layout
  options.use(autoLayoutCreater);
  // 生成 svg
  await options.use(svgCreater);
  return options.svg;
}

// (async () => {
//   // @ts-ignore
//   const svg = await main({
//     inputContent: 'ctg1 1 10000000 ctg2 1 10000000\nctg1 1 10000000 ctg3 1 10000000\nctg3 1 10000000 ctg4 1 10000000\nctg4 1 10000000 ctg5 1 10000000',
//     min_alignment_length: 0,
//     max_evalue: 1e-5,
//     min_identity: 0,
//     min_bit_score: 1000,
//     chro_thickness: 15,
//     no_label: false,
//     label_angle: 30,
//     label_font_size: 30,
//     label_pos: 'right',
//     label_x_offset: 0,
//     label_y_offset: 0,
//     gap_length: 0.2,
//     svg_height: 800,
//     svg_width: 1200,
//     svg_space: 0.2,
//     svg_content_width: 1200 * (1 - 0.2),
//     show_scale: false,
//     scale: 0,
//     chro_axis: false,
//     chro_axis_pos: 'bottom',
//     chro_axis_unit: '10k',
//     align: 'center',
//     hl_min1px: false,
//     highlightContent: 'a 20 30',
//     karyotypeContent: 'ctg1:1:10000000\nctg3:1:10000000 ctg2:10000000:1\nctg4:1:10000000\nctg5:1:10000000',
//     // karyotypeContent: '',
//     parameterContent: 'label_font_size=1\nlabel_font_size=2\n\nlabel_font_size=4',
//     gffContent: '',

//     use: function (this: Options, plugin: (...args: any) => void) {
//       return plugin.apply(this);
//     },
//     style: 'classic',
//   } as Options);
//   // console.log(svg);
// })();