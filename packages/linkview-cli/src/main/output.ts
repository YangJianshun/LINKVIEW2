import fs from 'fs';
import sharp from 'sharp';
import { Options } from '@linkview/linkview-core/';
const output = (svgContent: string | undefined, options: Options) => {
  const { output: prefix, svg_width: width, svg_height: height} = options;
  if (!svgContent) svgContent = '';
  fs.writeFileSync(`${prefix}.svg`, svgContent);
  sharp(`${prefix}.svg`)
    .png()
    .toFile(`${prefix}.png`)
    .then(function (info) {
      console.log(`LINKVIEW2 Output Files: ${prefix}.svg ${prefix}.png`);
    });
}

export default output;
