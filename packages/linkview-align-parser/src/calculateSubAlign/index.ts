import { Alignment } from '../@types/alignment';
import { intersection } from '../utils/internal';

// 根据 真实 alignment 计算出，在给定展示区间的 alignment
export function calculateSubAlign(
  alignment: Alignment,
  displayStart1: number,
  displayEnd1: number,
  displayStart2: number,
  displayEnd2: number
) {
  const { start1, end1, start2, end2 } = alignment;
  const displayStart1Position = calculatePosition(start1, end1, displayStart1);
  const displayEnd1Position = calculatePosition(start1, end1, displayEnd1);
  const displayStart2Position = calculatePosition(start2, end2, displayStart2);
  const displayEnd2Position = calculatePosition(start2, end2, displayEnd2);
  console.log(displayStart1Position, displayEnd1Position, displayStart2Position, displayEnd2Position)
  const displayPosions = intersection(
    [displayStart1Position, displayEnd1Position],
    [displayStart2Position, displayEnd2Position]
  );
  if (displayPosions.length === 0) return null;
  const [displayStartPosition, displayEndPosition] = displayPosions
  displayStart1 = position2Site(start1, end1, displayStartPosition);
  displayEnd1 = position2Site(start1, end1, displayEndPosition);
  displayStart2 = position2Site(start2, end2, displayStartPosition);
  displayEnd2 = position2Site(start2, end2, displayEndPosition);
  return Object.assign(alignment, {
    start1: displayStart1,
    end1: displayEnd1,
    start2: displayStart2,
    end2: displayEnd2,
  }) as Alignment;
}

function calculatePosition(start: number, end: number, point: number) {
  if (point < Math.min(start, end)) return 0;
  if (point > Math.max(start, end)) return 1;
  return (Math.abs(point - start) + 1) / (Math.abs(end - start) + 1);
}

function position2Site(start: number, end: number, position: number) {
  if (position === 0) return start;
  if (position === 1) return end;
  let distance = Math.abs(end - start) + 1;
  // console.log(start, distance, position, distance * position);
  const site =
    start > end
      ? start - (distance * position - 1)
      : start + (distance * position - 1);
  return Number(site.toFixed(0));
}

// === test ===
// const alignment: Alignment = {
//   start1: 1,
//   end1: 100,
//   start2: 501,
//   end2: 600,
//   alignLen: 100,
//   color: 'red',
//   opacity: 1,
//   ctg1: 'ctg1',
//   ctg2: 'ctg2',
// };
// const displayStart1 = 51;
// const displayEnd1 = 60;
// const displayStart2 = 545;
// const displayEnd2 = 555;

// console.log(calculatePosition(1, 100, 30));
// console.log(calculatePosition(100, 1, 71));

// const alignment: Alignment = {
//   start1: 1,
//   end1: 100,
//   start2: 600,
//   end2: 501,
//   alignLen: 100,
//   color: 'red',
//   opacity: 1,
//   ctg1: 'ctg1',
//   ctg2: 'ctg2',
// };
// const displayStart1 = 10;
// const displayEnd1 = 60;
// const displayStart2 = 531;
// const displayEnd2 = 551;

const alignment: Alignment = {
  start1: 101,
  end1: 200,
  start2: 300,
  end2: 201,
  alignLen: 100,
  color: 'red',
  opacity: 1,
  ctg1: 'ctg1',
  ctg2: 'ctg2',
};
const displayStart1 = 150;
const displayEnd1 = 200;
const displayStart2 = 231;
const displayEnd2 = 300;

const alignDisplay = calculateSubAlign(
  alignment,
  displayStart1,
  displayEnd1,
  displayStart2,
  displayEnd2
);

console.log(alignDisplay);
