import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Circle,
  Line,
  Shape,
  Group,
} from "react-konva";
import { observer } from "mobx-react";
import { useStores } from "@/store";
import {
  TickDirection,
  POINT_LEN_0,
  POINT_LEN_1,
  POINT_LEN_2,
} from "./constannts";
import style from "./Tick.module.scss";
import { formatBpPos } from "@/utils/format";
import { calcTickUnit } from "./utils";

export * from "./constannts";

interface ITickProps {
  tickDirection: TickDirection;
  x: number;
  y: number;
  tickUnit?: number;
  start: number;
  end: number;
  widthPerBp: number; // 1px 代表多少 bp
  showLabel?: boolean;
  labelOffset?: [x: number, y: number];
  labelFontSize?: number;
  // 标签中保留的小数位数
  labelFixed?: number;
  labelRotation?: number;
}

const Contig: React.FC<ITickProps> = (props) => {
  const {
    tickDirection,
    x,
    y,
    start,
    end,
    widthPerBp,
    tickUnit = calcTickUnit(start - end + 1, widthPerBp),
    showLabel = false,
    labelOffset = [0, 0],
    labelFontSize = 12,
    labelFixed = 2,
    labelRotation = 0,
  } = props;

  const width = (end - start + 1) * widthPerBp;
  const lineJSX = (
    <Line points={[x, y, x + width, y]} stroke="black" strokeWidth={0.5} />
  );
  const pointsJSX = useMemo(() => {
    const firstPointBp = Math.ceil(start / tickUnit) * tickUnit;
    const result = [];
    for (
      let tmpPointBp = firstPointBp;
      tmpPointBp < end;
      tmpPointBp += tickUnit
    ) {
      const pointX = x + (tmpPointBp - start + 1) * widthPerBp;
      let pointLen = POINT_LEN_0;
      if (tmpPointBp % (5 * tickUnit) === 0) {
        pointLen = POINT_LEN_1;
      }
      if (tmpPointBp % (10 * tickUnit) === 0) {
        pointLen = POINT_LEN_2;
        if (showLabel) {
          const textY =
            tickDirection === TickDirection.Down
              ? y + POINT_LEN_2 + 2
              : y - POINT_LEN_2 - 12;
          const [offsetX, offsetY] = labelOffset;

          result.push(
            <Text
              text={formatBpPos({ bpPos: tmpPointBp, fixed: labelFixed })}
              x={pointX - 50 + offsetX}
              y={textY + offsetY}
              width={100}
              fontSize={labelFontSize}
              align="center"
              key={`text ${tmpPointBp}`}
              rotation={labelRotation}
            />
          );
        }
      }

      const [pointY0, pointY1] = {
        [TickDirection.Up]: [y, y - pointLen],
        [TickDirection.Down]: [y, y + pointLen],
        [TickDirection.UpAndDown]: [y - pointLen, y + pointLen],
      }[tickDirection];
      result.push(
        <Line
          points={[pointX, pointY0, pointX, pointY1]}
          stroke="black"
          strokeWidth={0.5}
          key={pointX}
        />
      );
    }
    return result;
  }, [x, y, start, end, tickUnit]);

  return (
    <Group>
      {pointsJSX}
      {lineJSX}
    </Group>
  );
};

export default observer(Contig);
