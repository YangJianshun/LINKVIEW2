import checkType from '../checkType';
import parseAlignFile, { parserCreater, filterCreater } from '../parser';
import { FilterAlignOpt } from '../@types/filterAlign';
import filterAlignCreater from '../filterAlign';

const alignParser = async (fileName: string, filterAlignOpt?: FilterAlignOpt) => {
    const { alignType, parserOpt } = await checkType(fileName);
    const parser = parserCreater(parserOpt, fileName);
    const filter = filterCreater(parserOpt ? parserOpt.filters: null);
    const filterAlign = filterAlignOpt ? filterAlignCreater(filterAlignOpt) : null;
    const { alignments, alignmentsByCtgs, lenInfo } = await parseAlignFile(
      fileName,
      parser,
      filter,
      filterAlign
    );
    return { alignType, alignments, alignmentsByCtgs, lenInfo };
}

export default alignParser;