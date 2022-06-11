
export const hex2Rgb = (hexColor: string) => {
  hexColor = hexColor.replace(/^#/, '');
  let r = 0, g = 0, b = 0;
  if (hexColor.length === 3) {
    r = parseInt(hexColor[0], 16);
    g = parseInt(hexColor[1], 16);
    b = parseInt(hexColor[2], 16);
  } else if (hexColor.length === 6) {
    r = parseInt(hexColor.slice(0, 2), 16);
    g = parseInt(hexColor.slice(2, 4), 16);
    b = parseInt(hexColor.slice(4, 6), 16);
  }
  return `rgb(${r}, ${g}, ${b})`;
}
