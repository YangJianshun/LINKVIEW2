import fs from 'fs';
import { Command } from 'commander';
import chalk from 'chalk';
import { Options } from '../@types/options';

function toArray(val: any | any[]) {
  if (val instanceof Array) {
    return val;
  } else if (val.length && !(typeof val === 'string')) {
    return Array.from(val);
  } else {
    return [val];
  }
}

function parseParamInt(val: string, param: string) {
  const result = parseInt(val);
  if (isNaN(result))
    throw new Error(
      `Illegal argument of option '${param}', ${val} is not an integer`
    );
  return result;
}

function parseParamFloat(val: string, param: string) {
  const result = parseFloat(val);
  if (isNaN(result))
    throw new Error(
      `Illegal argument of option '${param}', ${val} is not a number`
    );
  return result;
}

function parseParamFiles(
  fileNames: string | string[],
  allowMultiple: boolean = true,
  errInfo: string
) {
  fileNames = toArray(fileNames);
  if (allowMultiple) {
    for (let index = 0, len = fileNames.length; index < len; index++) {
      const fileName = fileNames[index];
      const splitInputs = fileName.split(',');
      fileNames.splice(index, 1, ...splitInputs);
      index += splitInputs.length - 1;
    }
  }
  for (let fileName of fileNames) {
    if (!fs.existsSync(fileName)) {
      throw new Error(`${errInfo}, ${fileName} not exist!`);
    }
  }
  return fileNames;
}

function parseParamSingleFile(fileName: string, param: string) {
  return parseParamFiles(
    fileName,
    false,
    `Illegal argument of option '${param}'`
  )[0];
}

function parseParamMultipleFile(fileNames: string | string[], param: string) {
  return parseParamFiles(
    fileNames,
    true,
    `Illegal argument of option '${param}'`
  );
}

function parseParamInput(fileNames: string | string[]) {
  return parseParamFiles(fileNames, true, `Illegal argument`);
}

export default function paramsParser(): Options {
  const program = new Command();
  if (process.argv.indexOf('-h') >= 0 || process.argv.indexOf('--help') >= 0) {
    process.argv.splice(2, process.argv.length, '-h');
  }

  program
    .version('0.0.0')
    .name('LINKVIEW2')
    .argument('<input...>', 'input alignments file(s)');

  program
    .option('\nNormal options:')
    .option(
      '-k, --karyotype <file>',
      'Karyotype file, which determines the layout structure of the drawing.',
      (fileName) => parseParamSingleFile(fileName, '-k, --karyotype <file>')
    )
    .option(
      '-hl, --highlight <file(s)>',
      'Highlight file, indicating the interval to be highlighted.  Separate multiple files with commas.',
      (fileNames) =>
        parseParamMultipleFile(fileNames, '-hl, --highlight <file(s)>')
    )
    .option(
      '--hl_min1px',
      'Forces each highlight to be at least one pixel wide.'
    )
    .option(
      '--chro_len <file(s)>',
      'Length file, specify the length of each chromosome.  Separate multiple files with commas.',
      (fileNames) => parseParamMultipleFile(fileNames, '--chro_len <file(s)>')
    )
    .option(
      '-g --gff <file(s)>',
      'One or multiple gff files, separated by commas.',
      (fileNames) => parseParamMultipleFile(fileNames, '-g --gff <file(s)>')
    )
    .option('--scale [string]', 'Display scale bar.');

  program
    .option('\nFilter options:')
    .option(
      '--min_alignment_length <number>',
      'Minimum threshold for alignment length, default=0.',
      (minAlignmentLength) =>
        parseParamFloat(minAlignmentLength, '--min_alignment_length <number>'),
      0
    )
    .option(
      '--min_identity <number>',
      'Minimum threshold for identity, default=70.',
      (minIdentity) => parseParamFloat(minIdentity, '--min_identity <number>'),
      70
    )
    .option(
      '--min_bit_score <number>',
      'Minimum threshold for bit score (if bit score exists), default=1000.',
      (minBitScore) => parseParamFloat(minBitScore, '--min_bit_score <number>'),
      1000
    )
    .option(
      '--max_evalue <number>',
      'Maximum threshold for evaluate (if evaluate exists), default=1e-5.',
      (maxEvalue) => parseParamFloat(maxEvalue, '--max_evalue <number>'),
      1e-5
    );

  program
    .option('\nDrawing options:')
    .option(
      '--chro_thickness <number>',
      'Thickness of chromosome(s), default=15',
      (chroThickness) =>
        parseParamInt(chroThickness, '--chro_thickness <number>'),
      15
    )
    .option('-n, --no_label', 'Do not show label(s)')
    .option(
      '--label_font_size <number>',
      'Font size of the label, default=18',
      (labelFontSize) =>
        parseParamInt(labelFontSize, '--label_font_size <number>'),
      18
    )
    .option(
      '--label_angle <number>',
      'Label rotation angle, default=0',
      (labelAngle) => parseParamInt(labelAngle, '--label_angle <number>'),
      0
    )
    .option('--chro_axis', 'Display the axis')
    .option(
      '--gap_length <number>',
      ' Length of gap between two chromosomes, if > 1,It represents Physical length, if<1, It represents total_length_of_this_line * this. default=0.2',
      (gapLength) => parseParamFloat(gapLength, '--gap_length <number>'),
      0.2
    )
    .option(
      '-p --parameter <file>',
      'Specify the parameters for each row separately in a file',
      (parameter) => parseParamSingleFile(parameter, '-p --parameter <file>')
    );

  program
    .option('\nSvg options:')
    .option(
      '--svg_height <number>',
      'height of svg, default=800',
      (svgHeight) => parseParamInt(svgHeight, '--svg_height <number>'),
      800
    )
    .option(
      '--svg_width <number>',
      'width of svg, default=1000',
      parseInt,
      1000
    )
    .option(
      '--svg_space <number>',
      'The proportion of white space left and right, default=0.2',
      (svgWidth) => parseParamInt(svgWidth, '--svg_space <number>'),
      0.2
    );
  program.option('\n');

  program.addHelpText(
    'afterAll',
    chalk.blue(`\n================================================`)
  );
  program.addHelpText('afterAll', chalk.blue(`\n\temail: 397441559@qq.com`));
  program.addHelpText(
    'afterAll',
    chalk.blue(`\nCopyright © 2020 JasonYang. All rights reserved.`)
  );
  program.addHelpText(
    'afterAll',
    chalk.blue(`\n================================================`)
  );

  program.parse(process.argv);

  const options = program.opts();
  const use = function (this: Options, plugin: (...args: any) => void) {
    plugin.apply(this);
  };
  return Object.assign(options, {
    inputs: parseParamInput(program.args),
    use,
  }) as Options;
}
