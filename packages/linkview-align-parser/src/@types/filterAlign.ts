export type FilterAlignOpt = {
  minIdentity?: number,
  minAlignmentLength?: number,
  maxEvalue?: number,
  minBitScore?: number,
  filterCtgPairs?: [string, string][],
}