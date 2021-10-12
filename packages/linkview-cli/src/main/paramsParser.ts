import { Command } from 'commander';
import chalk from 'chalk';
import {
  Options,
  parseParamSingleFile,
  parseParamMultipleFile,
  parseParamInt,
  parseParamFloat,
  parseParamLabelPos,
  parseParamAlign,
  parseParamInput,
  parseParamStyle,
  parseParamAxisPos,
  parseParamAxisUnit,
} from '@linkview/linkview-core';

export default function paramsParser(): Options {
  const program = new Command();
  if (process.argv.indexOf('-h') >= 0 || process.argv.indexOf('--help') >= 0) {
    process.argv.splice(2, process.argv.length, '-h');
  }

  program
    .version('1.0.5')
    .name('LINKVIEW2')
    .argument('<input...>', 'input alignments file(s).');

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
      '-g --gff <file(s)>',
      'One or multiple gff files, separated by commas.',
      (fileNames) => parseParamMultipleFile(fileNames, '-g --gff <file(s)>')
    )
    .option(
      '--scale <number>',
      'Physical distance (bp) represented by one pixel(px).',
      (scale) => parseParamInt(scale, '--scale <number>'),
      0
    )
    .option('--show_scale', 'Display scale bar.');

  program
    .option('\nFilter options:')
    .option(
      '--min_alignment_length <number>',
      'Minimum threshold for alignment length.',
      (minAlignmentLength) =>
        parseParamFloat(minAlignmentLength, '--min_alignment_length <number>'),
      0
    )
    .option(
      '--min_identity <number>',
      'Minimum threshold for identity.',
      (minIdentity) => parseParamFloat(minIdentity, '--min_identity <number>'),
      70
    )
    .option(
      '--min_bit_score <number>',
      'Minimum threshold for bit score (if bit score exists).',
      (minBitScore) => parseParamFloat(minBitScore, '--min_bit_score <number>'),
      1000
    )
    .option(
      '--max_evalue <number>',
      'Maximum threshold for evaluate (if evaluate exists).',
      (maxEvalue) => parseParamFloat(maxEvalue, '--max_evalue <number>'),
      1e-5
    );

  program
    .option('\nDrawing options:')
    .option(
      '--chro_thickness <number>',
      'Thickness of chromosome(s).',
      (chroThickness) =>
        parseParamInt(chroThickness, '--chro_thickness <number>'),
      15
    )
    .option('-n, --no_label', 'Do not show label(s)', false)
    .option(
      '--label_font_size <number>',
      'Font size of the label.',
      (labelFontSize) =>
        parseParamInt(labelFontSize, '--label_font_size <number>'),
      18
    )
    .option(
      '--label_angle <number>',
      'Label rotation angle.',
      (labelAngle) => parseParamInt(labelAngle, '--label_angle <number>'),
      30
    )
    .option(
      '--label_pos <left | center |  right>',
      'Label position, left or right.',
      (labelPos) => parseParamLabelPos(labelPos, '--label_pos <left | right>'),
      'right'
    )
    .option(
      '--label_x_offset <number>',
      'Label X offset.',
      (labelXOffset) =>
        parseParamInt(labelXOffset, '--label_x_offset <number>'),
      0
    )
    .option(
      '--label_y_offset <number>',
      'Label Y offset, default=0',
      (labelYOffset) =>
        parseParamInt(labelYOffset, '--label_y_offset <number>'),
      0
    )
    .option('--chro_axis', 'Display the axis.', false)
    .option(
      '--chro_axis_unit <string>',
      'Unit size of the axis.',
      (axisUnit) => parseParamAxisUnit(axisUnit, '--chro_axis_unit <string>'),
      'auto'
    )
    .option(
      '--chro_axis_pos <top | bottom | both>',
      'Position of the axis',
      (axisPos) =>
        parseParamAxisPos(axisPos, '--chro_axis_pos <top | bottom | both>'),
      'bottom'
    )
    .option(
      '--gap_length <number>',
      ' Length of gap between two chromosomes, if > 1,It represents Physical length, if<1, It represents total_length_of_this_line * this.',
      (gapLength) => parseParamFloat(gapLength, '--gap_length <number>'),
      0.2
    )
    .option(
      '--align <center | left | right>',
      'Align',
      (align) => parseParamAlign(align, '--align <center | left | right>'),
      'center'
    )
    .option(
      '-p --parameter <file>',
      'Specify the parameters for each row separately in a file.',
      (parameter) => parseParamSingleFile(parameter, '-p --parameter <file>')
    );

  program
    .option('\nStyle options:')
    .option('--bezier', 'Draw in Bezier style')
    .option(
      '--style <classic | simple>',
      'Drawing style, we have two built-in styles: classic, simple.',
      (style) => parseParamStyle(style, '--style <classic | simple>'),
      'classic'
    );

  program
    .option('\nSvg options:')
    .option(
      '--svg_height <number>',
      'height of svg.',
      (svgHeight) => parseParamInt(svgHeight, '--svg_height <number>'),
      800
    )
    .option(
      '--svg_width <number>',
      'width of svg.',
      (svgWidth) => parseParamInt(svgWidth, '--svg_width <number>'),
      1200
    )
    .option(
      '--svg_space <number>',
      'The proportion of white space left and right.',
      (svgWidth) => parseParamInt(svgWidth, '--svg_space <number>'),
      0.2
    );

  program
    .option('\nOutput options:')
    .option(
      '-o --output <string>',
      'output file prefix.',
      'linkview2_output'
    )

  program.option('\n');

  program.addHelpText(
    'afterAll',
    chalk.blue(`\n================================================`)
  );
  // program.addHelpText('afterAll', chalk.blue(`\n\temail: 397441559@qq.com`));
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
    return plugin.apply(this);
  };
  return Object.assign(options, {
    inputs: parseParamInput(program.args),
    use,
    svg_content_width: options.svg_width * (1 - options.svg_space),
  }) as Options;
}
