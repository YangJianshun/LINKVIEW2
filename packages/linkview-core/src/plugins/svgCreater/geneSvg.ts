import { Options } from '../../@types/options';
import { eachLine, intersection, complement } from '@linkview/linkview-align-parser';
import { renderItem } from './render';
import { SVG_GENE_EXON, SVG_GENE_INTRON } from './svgTemplates';
import { LayoutItem } from '../../@types/layout';

type MRNAInfo = {
  exons: [number, number][];
  UTR3s: [number, number][];
  UTR5s: [number, number][];
  introns?: [number, number][];
  pos: [number, number];
  parent: string | undefined;
  strand: '+' | '-';
}
type MRNAInfoMap = {
  [mRNAId: string]: MRNAInfo;
}
type Ctg2MRNAInfos = {
  [ctg: string]: MRNAInfo[]
}

const geneType = ['gene'];
const mRnaType = ['mrna'];
const exonType = ['exon'];
const utr3Type = ['three_prime_UTR', '3_UTR'];
const utr5Type = ['five_prime_UTR', '5_UTR'];

function parseAttributes(attr: string) {
  const res: {[key: string]: string} = {}
  if (!attr.endsWith(';')) attr += ';';
  let contentFlag = false;
  let lastPos = 0;
  for (let index = 0, len = attr.length; index < len; index++) {
    const char = attr[index];
    if (char === '"') {
      contentFlag = ! contentFlag;
    } else if (char === ';' && !contentFlag) {
      const item = attr.slice(lastPos, index);
      let [key, value] = item.split('=');
      value = value ? value.trim().replace(/"/g, '') : '';
      res[key] = value;
      lastPos = index + 1;
    }
  }
  return res;
}

function parseGff(gffFile: string, ctgs: Set<string>) {
  // const content = fs.readFileSync('gff').toString().trim();
  // const lines = content.split('/n');
  // 存储 mRNA 的相关信息，通过 mRNAId 索引
  const mRNAInfoMap: MRNAInfoMap = {};
  // 通过 ctg 索引的 mRNAInfo 列表
  const ctg2MRNAInfos: Ctg2MRNAInfos = {};

  const initMRNAInfoMap = (mRNAId: string) => {
    mRNAInfoMap[mRNAId] = {
      exons: [],
      UTR3s: [],
      UTR5s: [],
      pos: [-1, -1],
      parent: undefined,
      strand: '+',
    };
  };
  
  return eachLine(gffFile, (line) => {
    if (line.startsWith('#') || line.trim() === '') return true;
    let [ctg, source, annoType, start, end, score, strand, phase, attrStr] = line.split('\t');
    if (!ctgs.has(ctg)) return true;
    const attr =  parseAttributes(attrStr);
    const annoId = attr.ID;
    annoType = annoType.toLowerCase();
    if (mRnaType.includes(annoType)) {
      // 初始化
      if (!mRNAInfoMap[annoId]) {
        initMRNAInfoMap(annoId);
      }
      mRNAInfoMap[annoId].pos = [Number(start), Number(end)];
      mRNAInfoMap[annoId].parent = attr.Parent;
      mRNAInfoMap[annoId].strand = strand as '+' | '-';
      if (!ctg2MRNAInfos[ctg]) ctg2MRNAInfos[ctg] = [];
      ctg2MRNAInfos[ctg].push(mRNAInfoMap[annoId]);
    } else if (exonType.includes(annoType)) {
      const mRNAId = attr.Parent;
      if (!mRNAId) return true;
      if (!mRNAInfoMap[mRNAId]) initMRNAInfoMap(annoId);
      mRNAInfoMap[mRNAId].exons.push([Number(start), Number(end)]);
    } else if (utr3Type.includes(annoType)) {
      const mRNAId = attr.Parent;
      if (!mRNAId) return true;
      if (!mRNAInfoMap[mRNAId]) initMRNAInfoMap(annoId);
      mRNAInfoMap[mRNAId].UTR3s.push([Number(start), Number(end)]);
    } else if (utr5Type.includes(annoType)) {
      const mRNAId = attr.Parent;
      if (!mRNAId) return true;
      if (!mRNAInfoMap[mRNAId]) initMRNAInfoMap(annoId);
      mRNAInfoMap[mRNAId].UTR5s.push([Number(start), Number(end)]);
    }
    return true;
  }).then(() => {
    return {mRNAInfoMap, ctg2MRNAInfos};
  })
}

function parseGffContent(gffContent: string, ctgs: Set<string>) {
  // 存储 mRNA 的相关信息，通过 mRNAId 索引
  const mRNAInfoMap: MRNAInfoMap = {};
  // 通过 ctg 索引的 mRNAInfo 列表
  const ctg2MRNAInfos: Ctg2MRNAInfos = {};

  const initMRNAInfoMap = (mRNAId: string) => {
    mRNAInfoMap[mRNAId] = {
      exons: [],
      UTR3s: [],
      UTR5s: [],
      pos: [-1, -1],
      parent: undefined,
      strand: '+',
    };
  };
  const lines = gffContent.trim().split('\n');
  for (const line of lines) {
    if (line.startsWith('#') || line.trim() === '') continue;
    let [ctg, source, annoType, start, end, score, strand, phase, attrStr] = line.split('\t');
    if (!ctgs.has(ctg)) continue;
    const attr =  parseAttributes(attrStr);
    const annoId = attr.ID;
    annoType = annoType.toLowerCase();
    if (mRnaType.includes(annoType)) {
      // 初始化
      if (!mRNAInfoMap[annoId]) {
        initMRNAInfoMap(annoId);
      }
      mRNAInfoMap[annoId].pos = [Number(start), Number(end)];
      mRNAInfoMap[annoId].parent = attr.Parent;
      mRNAInfoMap[annoId].strand = strand as '+' | '-';
      if (!ctg2MRNAInfos[ctg]) ctg2MRNAInfos[ctg] = [];
      ctg2MRNAInfos[ctg].push(mRNAInfoMap[annoId]);
    } else if (exonType.includes(annoType)) {
      const mRNAId = attr.Parent;
      if (!mRNAId) continue;
      if (!mRNAInfoMap[mRNAId]) initMRNAInfoMap(annoId);
      mRNAInfoMap[mRNAId].exons.push([Number(start), Number(end)]);
    } else if (utr3Type.includes(annoType)) {
      const mRNAId = attr.Parent;
      if (!mRNAId) continue;
      if (!mRNAInfoMap[mRNAId]) initMRNAInfoMap(annoId);
      mRNAInfoMap[mRNAId].UTR3s.push([Number(start), Number(end)]);
    } else if (utr5Type.includes(annoType)) {
      const mRNAId = attr.Parent;
      if (!mRNAId) continue;
      if (!mRNAInfoMap[mRNAId]) initMRNAInfoMap(annoId);
      mRNAInfoMap[mRNAId].UTR5s.push([Number(start), Number(end)]);
    }
  }
  return {mRNAInfoMap, ctg2MRNAInfos};
}

function assignCtg2MRNAInfosSingle(
  target: Ctg2MRNAInfos,
  source: Ctg2MRNAInfos
) {
  for (let ctg in source) {
    if (!(ctg in target)) {
      target[ctg] = source[ctg];
    } else {
      target[ctg].push(...source[ctg]);
    }
  }
}

function mRNAInfosDeOverlap(mRNAInfos: MRNAInfo[]) {
  mRNAInfos.sort((a, b) => a.pos[0] - b.pos[0]);
  let lastStart = 0, lastEnd = 0;
  for (let index = 0, count =  mRNAInfos.length; index < count; index++) {
    const mRNAInfo = mRNAInfos[index];
    if (!mRNAInfo) continue;
    const [start, end] = mRNAInfo.pos;

    if (intersection([lastStart, lastEnd], [start, end]).length !== 0) {
      mRNAInfos.splice(index, 1);
      index--;
      count--;
    } else {
      lastStart = start;
      lastEnd = end;
    }
  }
}

function renderExons(intervals: [number, number][], direction: number, layoutItem: LayoutItem, className: string) {
  const svgContents: string[] = [];
  for (const [intervalStart, intervalEnd] of  intervals) {
    const [xStart, yStart] = layoutItem.getSvgPos!(intervalStart, 'top');
    const [xEnd] = layoutItem.getSvgPos!(intervalEnd, 'top', true);
    const xMin = Math.min(xStart, xEnd);
    const xMax = Math.max(xStart, xEnd);
    const xMinMiddle = xMin + (xMax - xMin) * 0.2;
    const xMaxMiddle = xMin + (xMax - xMin) * 0.8;
    const yTop = yStart + layoutItem.svgHeight! * 0.2;
    const yMiddle = yStart + layoutItem.svgHeight! * 0.5;
    const yBottom = yStart + layoutItem.svgHeight! * 0.8;
    const svgGeneExonPropsForward = {
      x1: xMin,
      y1: yTop,
      x2: xMin,
      y2: yBottom,
      x3: xMaxMiddle,
      y3: yBottom,
      x4: xMax,
      y4: yMiddle,
      x5: xMaxMiddle,
      y5: yTop,
      className,
    }
    const svgGeneExonPropsReverse = {
      x1: xMin,
      y1: yMiddle,
      x2: xMinMiddle,
      y2: yBottom,
      x3: xMax,
      y3: yBottom,
      x4: xMax,
      y4: yTop,
      x5: xMinMiddle,
      y5: yTop,
      className,
    }
    svgContents.push(renderItem(SVG_GENE_EXON, direction > 0 ? svgGeneExonPropsForward : svgGeneExonPropsReverse))
  }
  return svgContents;
}

export default async function geneSvg(this: Options) {
  const options = this;
  const { layout, gff: gffs, gffContent } = options;
  const svgContents: string[] = [];
  const mRNAInfoMap: MRNAInfoMap = {};
  const ctg2MRNAInfos: Ctg2MRNAInfos = {};
  // 先存储 ctgs，读取 gff 文件的时候，如果 ctg 不在 ctgs 中，就不往内存中存
  const ctgs = new Set<string>();
  layout.forEach(layoutLine => {
    layoutLine.forEach(layoutItem => {
      const { ctg } = layoutItem;
      ctgs.add(ctg);
    })
  })
  if (gffs) {
    for (let gff of gffs) {
      const {mRNAInfoMap: mRNAInfoMapSingle, ctg2MRNAInfos: ctg2MRNAInfosSingle} = await parseGff(gff, ctgs)
      Object.assign(mRNAInfoMap, mRNAInfoMapSingle);
      assignCtg2MRNAInfosSingle(ctg2MRNAInfos, ctg2MRNAInfosSingle)
    }
  } else if (gffContent) {
    const {mRNAInfoMap: mRNAInfoMapSingle, ctg2MRNAInfos: ctg2MRNAInfosSingle} = parseGffContent(gffContent, ctgs)
    Object.assign(mRNAInfoMap, mRNAInfoMapSingle);
    assignCtg2MRNAInfosSingle(ctg2MRNAInfos, ctg2MRNAInfosSingle)
  }

  layout.forEach(layoutLine => {
    layoutLine.forEach(layoutItem => {
      const { ctg, start, end } = layoutItem;
      const min = Math.min(start, end);
      const max = Math.max(start, end);
      let mRNAInfos = ctg2MRNAInfos[ctg];
      if (!mRNAInfos) return;
      mRNAInfos = mRNAInfos.filter(mRNAInfo => {
        const [mRNAStart, mRNAEnd] = mRNAInfo.pos;
        if (mRNAEnd < min || mRNAStart > max ) return false;
        return true;
      })
      mRNAInfosDeOverlap(mRNAInfos);
      // console.log(ctg, mRNAInfos.map(mRNAInfo => mRNAInfo.pos));
      for (let mRNAInfo of mRNAInfos) {
        const {exons, UTR3s, UTR5s, strand} = mRNAInfo;
        const [mRNAStart, mRNAEnd] = mRNAInfo.pos;
        const introns = complement([mRNAStart, mRNAEnd], [...exons, ...UTR3s, ...UTR5s]);
        let direction = 1;
        if (strand === '-') direction *= -1;
        if (start < end) direction *= -1;

        svgContents.push(...renderExons(exons, direction, layoutItem, 'exon'));
        svgContents.push(...renderExons(UTR3s, direction, layoutItem, 'UTR3'));
        svgContents.push(...renderExons(UTR5s, direction, layoutItem, 'UTR5'));
        
        for (const [intronStart, intronEnd] of introns) {
          const [x1, y1] = layoutItem.getSvgPos!(intronStart, 'top');
          const [x2] = layoutItem.getSvgPos!(intronEnd, 'top');

          svgContents.push(renderItem(SVG_GENE_INTRON, {
            x1,
            x2,
            y: y1 + layoutItem.svgHeight! * 0.5,
          }))
        }
      }
      
    })
  })
  // console.log(mRNAInfoMap);
  // console.log(ctg2MRNAInfos);
  if (!options.svg_template) options.svg_template = [];
  options.svg_template.push({ content: svgContents });
  return options;
}