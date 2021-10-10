import { Alignment, calculateSubAlign, DEFAULT_COLOR_FLAG, DEFAULT_OPACITY_FLAG } from '@linkview/linkview-align-parser';
import { Options } from '../../@types/options';
import { renderItem } from './render';
import { SVG_AXIS_POINT, SVG_AXIS_TEXT } from './svgTemplates';
import { Layout, LayoutItem } from '../../@types/layout';

const UNIT1_SIZE = 2;
const UNIT2_SIZE = 5;
const UNIT3_SIZE = 8;
const TEXT_DISTANCE = 12;
const AXIS_ANGLE = 25;
const MB = 1000000
const KB = 1000

function inferUnit(layout: Layout) {
  let maxLen = 0;
  layout.forEach(layoutLine => {
    let len = 0;
    layoutLine.forEach(layoutItem => {
      len += Math.abs(layoutItem.start - layoutItem.end);
    })
    if (len > maxLen) maxLen = len;
  })
  // 保证最长的行，不超过 20 个带有标签的刻度
  let unit = 1;
  while (true) {
    const count = maxLen / unit / 5;
    if (count <= 20) break;
    unit *= 10;
  }
  return unit;
}

function getSingleAxis(layoutItem: LayoutItem, unit: number, pos: 'top' | 'bottom' | 'both') {
  const svgContents: string[] = [];
  const {start, end} = layoutItem;
  // console.log(start, end, unit);
  const min = Math.min(start, end);
  const max = Math.max(start, end);
  let cur = min % unit === 0 ? min : min - (min % unit) + unit;

  // console.log('cur', cur)
  // console.log('unitStart', unitStart);
  const getSinglePointAxis = (site: number, pos: 'top' | 'bottom') => {
    const svgContents: string[] = [];
    const [x1, y] = layoutItem.getSvgPos!(site, pos, true);
    const [x2] = layoutItem.getSvgPos!(site, pos, false);
    const x = (x1 + x2) / 2;
    let unitSize = UNIT1_SIZE;
    if (site % (unit * 10) === 0) {
      unitSize = UNIT3_SIZE
    } else if (site % (unit * 5) === 0) {
      unitSize = UNIT2_SIZE
    }
    const svgProps = {
      x,
      y1: y,
      y2: y + (pos === 'top' ? -unitSize : unitSize),
      textX: x,
      textY: y + (pos === 'top' ? -TEXT_DISTANCE : TEXT_DISTANCE),
      textAngle: pos === 'top' ? 360 - AXIS_ANGLE : AXIS_ANGLE,
      text: formatSite(site),
    };
    svgContents.push(renderItem(SVG_AXIS_POINT, svgProps))
    if (site % (unit * 5) === 0) {
      svgContents.push(renderItem(SVG_AXIS_TEXT, svgProps))
    }
    return svgContents;
  }

  while (cur < max) {
    if (pos === 'both' || pos === 'bottom') {
      svgContents.push(...getSinglePointAxis(cur, 'bottom'));
    }
    if (pos === 'both' || pos === 'top') {
      svgContents.push(...getSinglePointAxis(cur, 'top'));
    }
    cur += unit;
  }
  return svgContents;
}

function formatSite(site: number) {
  if (site > MB) {
    return `${(site / MB).toFixed(2)} Mb`
  } else if (site > KB) {
    return `${(site / KB).toFixed(2)} Kb`
  } else {
    return `${site} bp`
  }
}

export default function axisSvg(this: Options) {
  const options = this;
  const { layout, alignmentsByCtgs } = options;
  const svgContents: string[] = [];
  const unitAuto = inferUnit(layout);

  layout.forEach((layoutLine, index) => {
    const drawOptionsItem = options.getDrawOptionsItem!(index);
    const {chro_axis: chroAxis, chro_axis_pos: chroAxisPos} = drawOptionsItem;
    if (chroAxis) {
      const unit = drawOptionsItem.chro_axis_unit === 'auto' ? unitAuto : drawOptionsItem.chro_axis_unit;
      // console.log('unit', unit);
      layoutLine.forEach(layoutItem => {
        svgContents.push(...getSingleAxis(layoutItem, unit, chroAxisPos));
      })
    }
  })

  if (!options.svg_template) options.svg_template = [];
  options.svg_template.push({ content: svgContents });
  return options;
}
