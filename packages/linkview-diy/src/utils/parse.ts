export const parseBpPos = (bpPos: string) => {
  // 解析 3Mb 100 bp 100
  bpPos = bpPos.replace(/,/g, "").replace(/\s/g, "");
  const matchSuffixRes = bpPos.match(/[a-zA-Z]+$/);
  const matchNumRes = bpPos.match(/^\d+\.?(\d+)?/);
  const suffix = matchSuffixRes ? matchSuffixRes[0].toLowerCase() : "bp";
  const num = matchNumRes ? +matchNumRes[0] : 0;

  const multiple = {
    g: 1000000000,
    gb: 1000000000,
    gbp: 1000000000,
    m: 1000000,
    mb: 1000000,
    mbp: 1000000,
    k: 1000,
    kb: 1000,
    kbp: 1000,
    b: 1,
    bp: 1,
  }[suffix];

  return Math.floor(num * (multiple || 0));
};
