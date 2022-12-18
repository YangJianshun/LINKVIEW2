const MIN_UNIT_PX = 5;
export const calcTickUnit = (length: number, widthPerBp: number) => {
  let unit = 1;
  while (true) {
    const unitPx = unit * widthPerBp;
    if (unitPx >= MIN_UNIT_PX) {
      return unit;
    }
    if (unitPx < MIN_UNIT_PX / 10) {
      unit *= 10;
    } else {
      unit += Math.ceil(unit / 10) || unit;
    }
  }
};
