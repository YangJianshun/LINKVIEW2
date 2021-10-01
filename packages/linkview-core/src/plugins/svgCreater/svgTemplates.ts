export const SVG_START =
  '<svg width="{svg_width}" height="{svg_height}" xmlns="http://www.w3.org/2000/svg" version="1.1">';
export const SVG_END = '</svg>';
export const SVG_CTG =
  '<rect x="{x}" y="{y}" width="{width}" height="{height}" fill="grey" class="chro"/>';
export const SVG_LABEL =
  '<text x="{x}" y="{y}" fill="black" font-size="{label_font_size}" transform="rotate({label_angle},{x} {y})" class="label">{ctg}</text>';
export const SVG_ALIGN =
  '<path d="M{x1},{y1} L{x2},{y2} L{x3},{y3} L{x4},{y4} Z" style="fill: {fill};opacity: {opacity};" class="align"/>';