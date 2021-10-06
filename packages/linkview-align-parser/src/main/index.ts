import checkType, { checkTypeFromContent } from '../checkType';
import parseAlignFile, { parserCreater, filterCreater, parseAlignFromContent } from '../parser';
import { FilterAlignOpt } from '../@types/filterAlign';
import filterAlignCreater from '../filterAlign';
import { withErrorConsole } from '../utils/error';

const alignParser = async (
  fileName: string,
  filterAlignOpt?: FilterAlignOpt
) => {
  const { alignType, parserOpt } = await checkType(fileName);
  const parser = withErrorConsole(parserCreater(parserOpt, fileName));
  const filter = filterCreater(parserOpt ? parserOpt.filters : null);
  const filterAlign = filterAlignOpt
    ? filterAlignCreater(filterAlignOpt)
    : null;
  const { alignments, alignmentsByCtgs, lenInfo } = await parseAlignFile(
    fileName,
    parser,
    filter,
    filterAlign
  );
  return { alignType, alignments, alignmentsByCtgs, lenInfo };
};

export const alignParserFromContent = (
  content: string,
  filterAlignOpt?: FilterAlignOpt
) => {
  const { alignType, parserOpt } = checkTypeFromContent(content);
  const parser = parserCreater(parserOpt, 'input alignments');
  const filter = filterCreater(parserOpt ? parserOpt.filters : null);
  const filterAlign = filterAlignOpt
    ? filterAlignCreater(filterAlignOpt)
    : null;
  const { alignments, alignmentsByCtgs, lenInfo } = parseAlignFromContent(
    content,
    parser,
    filter,
    filterAlign
  );
  return { alignType, alignments, alignmentsByCtgs, lenInfo };
};

export default alignParser;
