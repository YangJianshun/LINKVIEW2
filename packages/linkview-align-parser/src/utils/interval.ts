export function intersection(
  interval1: [number, number],
  interval2: [number, number]
) {
  const [start1, end1] = interval1.sort((a, b) => a - b);
  const [start2, end2] = interval2.sort((a, b) => a - b);

  if (end1 < start2 || end2 < start1) return [];
  else return [...interval1, ...interval2].sort((a, b) => a - b).slice(1, 3);
}

export function complement(
  wide: [number, number],
  intervals: [number, number][]
) {
  const [wideStart, wideEnd] = wide;
  let [front, back] = [wideStart, wideStart];
  const result: [number, number][] = [];
  intervals = intervals.map(interval => interval.sort((a, b) => a -b))
  intervals.sort((a, b) => a[0] - b[0]);
  for (let [start, end] of intervals) {
    if (start > wideEnd) break;
    front = start;
    if (front > back) result.push([back, front - 1]);
    if (end + 1 > back) back = end + 1;
  }
  if (back <= wideEnd) result.push([back, wideEnd]);
  return result;
}
