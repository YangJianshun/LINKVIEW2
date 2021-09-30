import { DrawOptionsItem, Options } from '../../@types/options';
import { warn } from '../../utils/error';
import { SvgProps } from '../../@types/svgTemplate';
import { Layout, LayoutLine, LayoutItem } from '../../@types/layout';
import { SVG_CTG } from './svgTemplates';
import { renderItem } from './render';

function calculateLineLen(
  layoutLine: LayoutLine,
  drowOptionsItem: DrawOptionsItem
) {
  const len = layoutLine
    .map(({ start, end }) => end - start + 1)
    .reduce((total, cur) => total + cur);
  const gapCount = layoutLine.length - 1;
  const gapLen =
    drowOptionsItem.gap_length >= 1
      ? drowOptionsItem.gap_length
      : drowOptionsItem.gap_length * len;
  const totalGapLen = gapLen * gapCount;
  return {
    len,
    totalLen: len + totalGapLen,
    gapLen,
    totalGapLen,
  };
}

function calculateScale(options: Options) {
  const { layout } = options;
  let maxLen = 0;
  for (let index = 0, levelCount = layout.length; index < levelCount; index++) {
    const layoutLine = layout[index];
    const drawOptionsItem = options.getDrawOptionsItem!(index);
    const lineLen = calculateLineLen(layoutLine, drawOptionsItem).totalLen;
    if (maxLen < lineLen) maxLen = lineLen;
  }

  const scale = options.svg_content_width / maxLen;
  return scale;
}

function getSvgPosCreater(layoutItem: LayoutItem) {
  return function (xPos: number, yPos: 'top' | 'bottom') {
    const { start, end } = layoutItem;
    const { x, y, width, height } = layoutItem.svgProps!;
    const xRelativePos = (xPos - start) / (end - start);
    const svgXPos = x! + width! * xRelativePos;
    const svgYPos = yPos === 'top' ? y! : y! + height!;
    return [svgXPos, svgYPos] as [svgXPos: number, svgYPos: number];
  };
}

export default function layoutSvg(this: Options) {
  const options = this;
  const { layout, drawOptions } = options;
  // k 文件 和 p 文件 行数不同，需要提醒用户检查
  if (drawOptions && layout.length !== drawOptions.length) {
    warn(
      `${options.karyotype} and ${options.parameter} have different lines！You'd better check it carefully！`
    );
  }
  let spaceVerticalTotal = options.svg_height;
  // 计算每层之间的间隔高度，为了预留后续每层都可以添加刻度，如果有刻度的话，空白高度相应减少
  // 同时过滤掉 start 或 end 为 0 的
  // 为什么要在 layoutSvg 这个 plugin 中删掉 start、 end 为 0 的 ctg？ 因为，前面要根据 alignment 推断，start 和 end
  for (let index = 0; index < layout.length; index++) {
    // 获取作图参数
    const drawOptionsItem = options.getDrawOptionsItem!(index);
    layout[index].forEach((layoutItem) => {
      if (layoutItem.start === 0 || layoutItem.end === 0)
        warn(
          `'${layoutItem.ctg}' is missing start and end information and will be ignored！`
        );
    });
    layout[index] = layout[index].filter(
      (layoutItem) => !(layoutItem.start === 0 || layoutItem.end === 0)
    );
    const layoutLine = layout[index];
    let svgHeight = 0; // 每一层的最大高度（如果某个 ctg 有 刻度的话，有刻度的会成为最大高度）
    if (layoutLine.length > 0) {
      layoutLine.forEach((layoutItem) => {
        layoutItem.svgHeight = drawOptionsItem.chro_thickness; // 后续有刻度，需要在这里加上 刻度 的高度；
        if (svgHeight < layoutItem.svgHeight) svgHeight = layoutItem.svgHeight;
      });
      spaceVerticalTotal -= svgHeight;
    } else {
      layout.splice(index, 1);
      drawOptions && drawOptions.splice(index, 1);
      index--;
    }
  }
  // 过滤之后拿到了新的 layout
  const levelCount = layout.length;
  const spaceVertical = spaceVerticalTotal / (levelCount + 1);
  // 计算比例尺（一个比值）
  // 如果用户 输入了 scale 参数，就不用计算比例尺。直接取倒数，因为用户输入的是一个像素代表多少bp，而我们需要的是一个bp对应多少像素
  const scale = options.scale ? 1 / options.scale : calculateScale(options);
  options.scale = scale;
  // 初始化 临时变量 topCur 和 svgContents
  let topCur = 0;
  let svgContents: string[] = [];
  // 开始遍历 layout
  layout.forEach((layoutLine, index) => {
    const svgHeight = Math.max(
      ...layoutLine.map((layoutItem) => layoutItem.svgHeight as number)
    );
    topCur += spaceVertical;
    topCur += svgHeight;
    // 获取作图参数
    const drawOptionsItem = options.getDrawOptionsItem!(index);

    const { gapLen, totalGapLen, totalLen, len } = calculateLineLen(
      layoutLine,
      drawOptionsItem
    );
    let leftCur = (options.svg_width * options.svg_space) / 2;
    switch (drawOptionsItem.align) {
      case 'left':
        break;
      case 'center':
        leftCur += (options.svg_content_width - totalLen * scale) / 2;
        break;
      case 'right':
        leftCur += options.svg_content_width - totalLen * scale;
        break;
      default:
        break;
    }
    layoutLine.forEach((layoutItem) => {
      const { ctg, start, end, svgHeight: svgHeightItem } = layoutItem;
      const svgProps: SvgProps = {};
      svgProps.y = topCur; // 如果有 上刻度的话，需要改这里；
      svgProps.height = drawOptionsItem.chro_thickness;
      svgProps.x = leftCur;
      svgProps.width = (end - start + 1) * scale;
      if (leftCur + svgProps.width > options.svg_width) {
        warn(`'${ctg}:${start}:${end}' is out of the scope of the picture！`);
      }
      leftCur += svgProps.width + gapLen * scale;
      layoutItem.svgProps = svgProps;
      layoutItem.getSvgPos = getSvgPosCreater(layoutItem);
      svgContents.push(renderItem(SVG_CTG, svgProps));
    });
  });
  if (!options.svg_template) options.svg_template = [];
  options.svg_template.push({ content: svgContents });
}
// https://wow.techbrood.com/fiddle/4786?vm=full
