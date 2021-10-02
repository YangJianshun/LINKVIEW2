export const SVG_START =
  '<svg width="{svg_width}" height="{svg_height}" xmlns="http://www.w3.org/2000/svg" version="1.1">';
export const SVG_END = '</svg>';
export const SVG_CTG =
  '<rect x="{x}" y="{y}" width="{width}" height="{height}" fill="grey" class="chro"/>';
export const SVG_LABEL =
  '<text x="{x}" y="{y}" fill="black" font-size="{label_font_size}" transform="rotate({label_angle},{x} {y})" class="label">{ctg}</text>';
export const SVG_ALIGN =
  '<path d="M{x1},{y1} L{x2},{y2} L{x3},{y3} L{x4},{y4} Z" style="{selfStyle}" class="align"/>';
export const SVG_ALIGN_BEZIER =
'<path d="M{x1},{y1} C{bezierX1},{bezierY1} {bezierX2},{bezierY2} {x2},{y2} L{x3},{y3} C{bezierX3},{bezierY3} {bezierX4},{bezierY4} {x4},{y4} Z" style="{selfStyle}"; class="align"/>'

export const styles = {
  classic: `<defs><style>
    .chro{
        fill: #838B83;            
    }
    .align {
        fill: #607B8B;
        opacity: 0.5;
    }
    .line {
        stroke: #000000;
        stroke-width: 3.5px;
    }
    .exon {
        fill: #36648B;
    }
    .UTR3 {
        fill: #2F4F4F;
    }
    .UTR5 {
        fill: #2F4F4F;
    }
    .intron {
        stroke: #36648B;
        stroke-width: 1.5px;
    }        
  </style></defs>`,
  simple: `<defs><style>
    .chro{
        stroke: #000000;
        fill: none;
    }
    .align {
        fill: #B7B7B7;
        opacity: 0.5;
    }
    .line {
        stroke: #000000;
        stroke-width: 3.5px;
    }
    .exon {
        fill: 	#515151;
    }
    .UTR3 {
        fill: #2F4F4F;
    }
    .UTR5 {
        fill: #2F4F4F;
    }
    .intron {
        stroke: #515151;
        stroke-width: 1.5px;
    }        
  </style></defs>`,
};