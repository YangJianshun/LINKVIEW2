import { AlignType } from "@linkview/linkview-align-parser";

export const alignTypeMap = {
  [AlignType.STANDARD]: "LINKVIEW 专属格式",
  [AlignType.BLAST]: "Blast",
  [AlignType.MINIMAP]: "Minimap",
  [AlignType.NUCMER]: "NUCMER",
  [AlignType.NUCMER_B]: "NUCMER B",
  [AlignType.NUCMER_T]: "NUCMER T",
  [AlignType.UNKNOWN]: "未知格式",
};
