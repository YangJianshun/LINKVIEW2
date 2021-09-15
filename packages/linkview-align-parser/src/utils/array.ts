export const allTrue = (arr: any[]) => arr.findIndex((i) => !Boolean(i)) === -1;

export const average = (nums: number[]) =>
  nums.length > 0
    ? nums.reduce((total, num) => total + num) / nums.length
    : NaN;
