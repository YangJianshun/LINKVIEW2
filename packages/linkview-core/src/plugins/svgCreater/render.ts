import { SvgTemplate } from '../../@types/svgTemplate';

export function renderItem(svgTemplateItem: string, dataSource: any) {
  // 解析出需要替换的变量，使用正则效率会低，因此采用字符串操作
  // 这里相当于一个简易的模版引擎，只支持替换一层，比如 '{a + {b}}'，只会将 b 替换，并不会做 a + sourceData[b] 的运算操作
  let result = svgTemplateItem;
  const tempArr =  svgTemplateItem.split('{');
  for (let item of tempArr) {
    const endIndex = item.indexOf('}');
    if (endIndex < 0) continue;
    const key = item.slice(0, endIndex);
    result = result.replace(`{${key}}`, dataSource[key] ?? '');
  }
  return result;
}

export default function render(svgTemplate: SvgTemplate, dataSource: any) {
  const svgContents: string[] = [];
  for (let svgTemplateItem of svgTemplate) {
    if (typeof svgTemplateItem === 'string') {
      svgContents.push(renderItem(svgTemplateItem, dataSource))
    } else {
      const { content } = svgTemplateItem;
      if (typeof content === 'string') {
        svgContents.push(content);
      } else {
        for (let contentLine of content) {
          svgContents.push(contentLine);
        }
      }
    }
  }
  return svgContents.join('\n');
}