export function intersection(
  interval1: [number, number],
  interval2: [number, number]
) {
  const [start1, end1] = interval1.sort((a, b) => a - b);
  const [start2, end2] = interval2.sort((a, b) => a - b);

  if (end1 < start2 || end2 < start1) return [];
  else return [...interval1, ...interval2].sort((a, b) => a - b).slice(1, 3);
}
