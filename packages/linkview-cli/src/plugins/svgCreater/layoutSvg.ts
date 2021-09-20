import { Options } from '../../@types/options';
import { warn } from '../../utils/error';
import { SvgProps } from '../../@types/svgTemplate';
import { Layout, LayoutLine } from '../../@types/layout';
import { SVG_CTG } from './svgTemplates';
import { renderItem } from './render';

function calculateLineLen(layoutLine: LayoutLine, options: Options) {
  const len = layoutLine.map(({start, end}) => end - start + 1).reduce((total, cur) => total + cur);
  const gapCount = layoutLine.length - 1;
  const gapLen = options.gap_length >= 1 ? options.gap_length : options.gap_length * len;
  const totalGapLen = gapLen *  gapCount;
  return {
    len,
    totalLen: len + totalGapLen,
    gapLen,
    totalGapLen
  };
}

function calculateScale(options: Options) {
  const { layout } = options;
  let maxLen = 0;
  layout.forEach(layoutLine => {
    const lineLen = calculateLineLen(layoutLine, options).totalLen;
    if (maxLen < lineLen) maxLen = lineLen;
  });

  const scale = options.svg_content_width / maxLen;
  return scale;
}

export default function layoutSvg(options: Options) {
  const layout = options.layout;
  let spaceVerticalTotal = options.svg_height;
  // 计算每层之间的间隔高度，为了预留后续每层都可以添加刻度，如果有刻度的话，空白高度相应减少
  // 同时过滤掉 start 或 end 为 0 的
  for (let index = 0; index < layout.length; index++) {
    layout[index].forEach(layoutItem => {
      if (layoutItem.start === 0 || layoutItem.end === 0) warn(`'${layoutItem.ctg}' is missing start and end information and will be ignored！`)
    })
    layout[index] = layout[index].filter(layoutItem => !(layoutItem.start === 0 || layoutItem.end === 0))

    const layoutLine = layout[index];
    let svgHeight = 0; // 每一层的最大高度（如果某个 ctg 有 刻度的话，有刻度的会成为最大高度）
    if (layoutLine.length > 0) {
      layoutLine.forEach(layoutItem => {
        layoutItem.svgHeight = options.chro_thickness; // 后续有刻度，需要在这里加上 刻度 的高度；
        if (svgHeight < layoutItem.svgHeight) svgHeight = layoutItem.svgHeight;
      })
      spaceVerticalTotal -= svgHeight;
    } else {
      layout.splice(index, 1);
      index --;
    }
  }
  // 过滤之后拿到了新的 layout
  const levelCount = layout.length;
  const spaceVertical = spaceVerticalTotal / (levelCount + 1);
  // 计算比例尺（一个比值）
  // 如果用户 输入了 scale 参数，就不用计算比例尺。直接取倒数，因为用户输入的是一个像素代表多少bp，而我们需要的是一个bp对应多少像素
  const scale = options.scale ? 1 / options.scale :  calculateScale(options);
  options.scale = scale;
  let topCur = 0;
  let svgContents: string[] = [];
  layout.forEach(layoutLine => {
    const svgHeight = Math.max(...layoutLine.map(layoutItem => layoutItem.svgHeight as number));
    topCur += spaceVertical;
    topCur += svgHeight;
    const {gapLen, totalGapLen, totalLen, len} = calculateLineLen(layoutLine, options);
    let leftCur = options.svg_width * options.svg_space / 2 + (options.svg_content_width - totalLen * scale) / 2;
    layoutLine.forEach(layoutItem => {
      const { ctg, start, end, svgHeight: svgHeightItem } = layoutItem;
      const svgProps: SvgProps = {}
      svgProps.y = topCur; // 如果有 上刻度的话，需要改这里；
      svgProps.height = options.chro_thickness;
      svgProps.x = leftCur
      svgProps.width = (end - start + 1) * scale;
      if (leftCur + svgProps.width > options.svg_width) {
        warn(`'${ctg}:${start}:${end}' is out of the scope of the picture！`)
      }
      leftCur += svgProps.width + gapLen * scale;
      layoutItem.svgProps = svgProps;
      svgContents.push(renderItem(SVG_CTG, svgProps))
    })
  })
  return svgContents;
}
// https://wow.techbrood.com/fiddle/4786?vm=full
