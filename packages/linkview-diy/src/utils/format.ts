const reverseStr = (str: string) => str.split("").reverse().join("");
const unitMap = {
  bp: 1,
  Kb: 1000,
  Mb: 1000000,
  Gb: 1000000000,
};

export const formatCount = (count: number | string) => {
  const reversed = reverseStr(count.toString());
  return reverseStr(reversed.replace(/(\d{3})(?!$)/g, "$1,"));
};

type BpPosSuffix = "bp" | "Kb" | "Mb" | "Gb";

export const formatBpPos = (options: {
  bpPos: number;
  fixed?: number;
  suffix?: BpPosSuffix;
}) => {
  const { bpPos, fixed = 2, suffix: optionSuffix } = options;
  const suffix = optionSuffix
    ? optionSuffix
    : (["Gb", "Mb", "Kb", "bp"] as BpPosSuffix[]).find(
        (suffix) => bpPos >= unitMap[suffix]
      ) || "bp";
  const unit = unitMap[suffix];
  const numStr = (bpPos / unit).toFixed(suffix === "bp" ? 0 : fixed);
  const [integer, decimal] = numStr.split(".");
  const numStrFormated = `${formatCount(integer)}${
    decimal ? `.${decimal}` : ""
  }`;
  return `${numStrFormated} ${suffix}`;
};
