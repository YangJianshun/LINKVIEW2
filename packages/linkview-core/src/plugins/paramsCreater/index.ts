import fs from 'fs';
import { Options, DrawOptionsItem } from '../../@types/options';
import { errorPos, warn } from '../../utils/error';
import { parseParamFloat, parseParamLabelPos, parseParamAlign, parseParamAxisUnit } from './utils';

const typoOfDrawOptions = {
  chro_thickness: 'number',
  no_label: 'boolean',
  label_font_size: 'number',
  label_angle: 'number',
  label_pos: 'string',
  label_x_offset: 'number',
  label_y_offset: 'number',
  chro_axis: 'boolean',
  chro_axis_unit: 'string',
  chro_axis_pos: 'string',
  gap_length: 'number',
  align: 'string',
}

export default function paramsCreater(this: Options) {
  const options = this;
  const drawOptions: DrawOptionsItem[] = []
  const { parameter, parameterContent } = options;
  const defualtDrawOptionsItem = {
    chro_thickness: options.chro_thickness,
    no_label: options.no_label,
    label_font_size: options.label_font_size,
    label_angle: options.label_angle,
    label_pos: options.label_pos,
    label_x_offset: options.label_x_offset,
    label_y_offset: options.label_y_offset,
    chro_axis: options.chro_axis as boolean,
    chro_axis_pos: options.chro_axis_pos,
    chro_axis_unit: parseParamAxisUnit(options.chro_axis_unit as string, 'chro_axis_unit'),
    gap_length: options.gap_length,
    align: options.align,
  }
  options.defualtDrawOptionsItem = defualtDrawOptionsItem;
  options.getDrawOptionsItem = (index: number) => index in drawOptions! ? drawOptions![index] : defualtDrawOptionsItem!;
  const content = parameter ? fs.readFileSync(parameter).toString().trim() : parameterContent?.trim();
  const parameterFile = parameter ? parameter : 'PARAMETER';
  if (!content) return options;
  const lines = content.split('\n');
  for ( let index = 0, lineCount = lines.length; index < lineCount; index++) {
    const line = lines[index];
    if (line.trim() === '') {
      drawOptions.push({...defualtDrawOptionsItem})
      continue;
    };
    const items = line.split(/\s+/);
    const drawOptionsItem: DrawOptionsItem = {...defualtDrawOptionsItem};
    for (let item of items) {
      const [drawOption, value] = item.split('=');
      let convertValue: boolean | number | string = value;
      if (!(drawOption in typoOfDrawOptions)) {
        const info = errorPos(line, drawOption, item);
        warn(`Illegal drawoption in '${drawOption}' ${parameter} line ${index + 1}\n${info}`);
        continue;
      }
      const typeOfDrawOption = typoOfDrawOptions[drawOption as keyof typeof typoOfDrawOptions];
      try {
      if (typeOfDrawOption === 'boolean') {
        convertValue = Boolean(value);
        if (!value) {
          convertValue = true;
        } else if (['false', 'f'].includes(value.toLowerCase())) {
          convertValue = false;
        }
      } else if (typeOfDrawOption === 'number') {
        convertValue = parseParamFloat(value, drawOption);
      } else if (typeOfDrawOption === 'string') {
        if (drawOption === 'label_pos') {
          convertValue = parseParamLabelPos(value, drawOption);
        } else if (drawOption === 'align') {
          convertValue = parseParamAlign(value, drawOption);
        } else if (drawOption === 'chro_axis_unit') {
          convertValue = parseParamAxisUnit(value, drawOption);
        }
      }
      } catch(error) {
        const errPosInfo = errorPos(line, value, item);
        (error as Error).message = `${(error as Error).message } at ${parameterFile} line ${index + 1}\n${errPosInfo}`
        throw error;
      }
      (drawOptionsItem[drawOption as keyof DrawOptionsItem] as boolean | number) = convertValue! as boolean | number;
    }
    drawOptions.push(drawOptionsItem)
  }
  options.drawOptions = drawOptions;
  // console.log('drawOptions', drawOptions);
  return options;
}

export * from './utils';