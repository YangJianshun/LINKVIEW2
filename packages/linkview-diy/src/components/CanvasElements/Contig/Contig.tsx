import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
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
import style from "./Contig.module.scss";
import { useStores } from "@/store";
import {
  MAX_CONTIG_LENGTH,
  DEFAULT_THICKNESS,
  CAPTURE_CONTROLLER_THICKNESS,
  CAPTURE_CONTROLLER_WRAPPED_LEN,
  TickMode,
  TickPos,
} from "./constants";
import Tick, { TickDirection } from "../Tick/Tick";

export * from "./constants";

// Contig 组件：在画布中可以移动，旋转，需要提供移动旋转的事件回调
// 支持截取，提供截取的回调

interface IConfigProps {
  contigName?: string;
  coor: [x: number, y: number];
  // canMove: boolean,
  // onMove: () => void,
  canCapture: boolean;
  onCapture?: (start: number, end: number) => void;
  // canRotate: boolean,
  // onRotate: () => void,
  length?: number; // 未知长度就设为 500Mb
  widthPerBp: number; // 1px 代表多少 bp
  thickness?: number;
  visibleInterval?: [start: number, end: number];
  onVisibleItervalChange?: (start: number, end: number) => void;
  // 当从外部改变 visibleInterval 时, contig 可见部分是否位于 initX
  alignToInitX?: boolean;
  // 如果 alignToInitX 为 false，则需要用到这个 prop，提供一个 originStart，用于计算 offset
  originStart?: number;
  tick: TickMode;
  // 刻度的最小单位，如果不传则自动计算最小单位
  tickUnit?: number;
  // 刻度的朝向
  tickDirection?: TickDirection;
  // 刻度的位置
  tickPos?: TickPos;
  // 刻度标签的偏移
  tickLabelOffset?: [x: number, y: number];
  // 刻度标签的旋转角度
  tickLabelRotation?: number;
  draggable?: boolean;
}

const Contig: React.FC<IConfigProps> = observer((props) => {
  // 校验 visibleInterval
  const { length = MAX_CONTIG_LENGTH, visibleInterval = [1, length] } = props;
  if (visibleInterval[0] < 1) visibleInterval[0] = 1;
  if (visibleInterval[0] > length - 1) visibleInterval[0] = length - 1;
  if (visibleInterval[1] < 2) visibleInterval[1] = 2;
  if (visibleInterval[1] > length) visibleInterval[1] = length;
  if (visibleInterval[1] <= visibleInterval[0])
    visibleInterval[1] = visibleInterval[0] + 1;
  const {
    contigName = "",
    canCapture,
    onCapture,
    coor,
    widthPerBp,
    thickness = DEFAULT_THICKNESS,
    // visibleInterval = [1, length],
    alignToInitX = true,
    originStart = visibleInterval[0],
    draggable = true,
    tick,
    tickLabelOffset = [0, 0],
    tickLabelRotation = 0,
  } = props;

  const [initX, initY] = coor;
  const [initStart, initEnd] = visibleInterval;
  const { styleStore } = useStores();
  const { cursor, setCursor } = styleStore;
  const [isCapture, setIsCapture] = useState(false);
  const [contigX, setContigX] = useState<number>(initX);
  const [contigY, setContigY] = useState<number>(initY);
  const [rightCaptureControllerX, setRightCaptureControllerX] = useState(
    initX + (initEnd - initStart + 1) * widthPerBp
  );
  // 跟 rightCaptureControllerX 一样，只不过 rightCaptureControllerX 用于控制 end capture 的位置，在 drag move 过程中不需要 set
  const [rightCaptureControllerX2, setRightCaptureControllerX2] = useState(
    initX + (initEnd - initStart + 1) * widthPerBp
  );
  const [start, setStart] = useState(initStart);
  const [end, setEnd] = useState(initEnd);
  const [dragOffset, setDragOffset] = useState<[x: number, y: number]>([0, 0]);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    setContigY(initY);
  }, [initY]);

  useEffect(() => {
    setContigX(initX);
  }, [initX]);

  useEffect(() => {
    const [initStart, initEnd] = visibleInterval;

    if (alignToInitX) {
      setContigX(initX);
      setRightCaptureControllerX(
        initX + (initEnd - initStart + 1) * widthPerBp
      );
      setRightCaptureControllerX2(
        initX + (initEnd - initStart + 1) * widthPerBp
      );
    } else {
      const offsetStart = initStart - originStart;
      const offsetX = offsetStart * widthPerBp;
      setContigX(initX + offsetX);
      setRightCaptureControllerX(
        initX + offsetX + (initEnd - initStart + 1) * widthPerBp
      );
      setRightCaptureControllerX2(
        initX + offsetX + (initEnd - initStart + 1) * widthPerBp
      );
    }
    setStart(initStart);
    setEnd(initEnd);
  }, [visibleInterval, widthPerBp]);

  useEffect(() => {
    onCapture && onCapture(start, end);
  }, [start, end]);

  const x2bpPos = (x: number) => {
    const offset = x - (contigX + dragOffset[0]);
    return start + offset / widthPerBp;
  };

  const bpPos2x = (bpPos: number) => {
    const offset = bpPos - start;
    return contigX + dragOffset[0] + offset * widthPerBp;
  };

  const visibleLength = useMemo(() => end - start + 1, [start, end]);

  const contigWidth = useMemo(
    () => visibleLength * widthPerBp,
    [visibleLength, widthPerBp]
  );

  const LeftCaptureController = (
    <Shape
      opacity={isHover || isCapture ? 0.8 : 0}
      sceneFunc={(context, shape) => {
        context.beginPath();
        context.lineTo(
          -CAPTURE_CONTROLLER_THICKNESS,
          -CAPTURE_CONTROLLER_THICKNESS
        );
        context.lineTo(
          CAPTURE_CONTROLLER_WRAPPED_LEN,
          -CAPTURE_CONTROLLER_THICKNESS
        );
        context.lineTo(CAPTURE_CONTROLLER_WRAPPED_LEN, 0);
        context.lineTo(0, 0);
        context.lineTo(0, thickness);
        context.lineTo(CAPTURE_CONTROLLER_WRAPPED_LEN, thickness);
        context.lineTo(
          CAPTURE_CONTROLLER_WRAPPED_LEN,
          CAPTURE_CONTROLLER_THICKNESS + thickness
        );
        context.lineTo(
          -CAPTURE_CONTROLLER_THICKNESS,
          CAPTURE_CONTROLLER_THICKNESS + thickness
        );
        context.closePath();
        context.fillStrokeShape(shape);
      }}
      x={contigX}
      y={initY}
      fill="rgb(241, 180, 64)"
      strokeWidth={1}
      draggable
      dragBoundFunc={(pos) => {
        const bpPos = x2bpPos(pos.x);
        let x = pos.x;
        if (bpPos <= 1) x = bpPos2x(1);
        if (bpPos >= end - 1) x = bpPos2x(end - 1);
        return { x, y: contigY + dragOffset[1] };
      }}
      onMouseEnter={() => {
        setIsHover(true);
        setCursor("move");
      }}
      onMouseLeave={() => {
        !isCapture && setCursor("default");
        setIsHover(false);
      }}
      onMouseDown={() => setIsCapture(true)}
      onDragStart={() => setIsCapture(true)}
      onDragMove={(e) => {
        const x = e.target.x();

        let bpPos = x2bpPos(x + dragOffset[0]);
        if (bpPos <= 1) bpPos = 1;
        if (bpPos >= end - 1) bpPos = end - 1;
        setStart(bpPos);
        setContigX(x);
      }}
      onDragEnd={() => {
        setIsCapture(false);
        setCursor("default");
      }}
    />
  );

  const RightCaptureController = (
    <Shape
      opacity={isHover || isCapture ? 0.8 : 0}
      sceneFunc={(context, shape) => {
        context.beginPath();
        context.lineTo(
          CAPTURE_CONTROLLER_THICKNESS,
          -CAPTURE_CONTROLLER_THICKNESS
        );
        context.lineTo(
          CAPTURE_CONTROLLER_THICKNESS,
          thickness + CAPTURE_CONTROLLER_THICKNESS
        );
        context.lineTo(
          -CAPTURE_CONTROLLER_WRAPPED_LEN,
          thickness + CAPTURE_CONTROLLER_THICKNESS
        );
        context.lineTo(-CAPTURE_CONTROLLER_WRAPPED_LEN, thickness);
        context.lineTo(0, thickness);
        context.lineTo(0, 0);
        context.lineTo(-CAPTURE_CONTROLLER_WRAPPED_LEN, 0);
        context.lineTo(
          -CAPTURE_CONTROLLER_WRAPPED_LEN,
          -CAPTURE_CONTROLLER_THICKNESS
        );

        context.closePath();
        context.fillStrokeShape(shape);
      }}
      x={rightCaptureControllerX}
      y={initY}
      fill="rgb(241, 180, 64)"
      strokeWidth={1}
      draggable
      dragBoundFunc={(pos) => {
        const bpPos = x2bpPos(pos.x);
        let x = pos.x;

        if (bpPos <= start + 1) x = bpPos2x(start + 1);
        if (bpPos >= length) x = bpPos2x(length);
        return { x, y: contigY + dragOffset[1] };
      }}
      onMouseEnter={() => {
        setCursor("move");
        setIsHover(true);
      }}
      onMouseLeave={() => {
        !isCapture && setCursor("default");
        setIsHover(false);
      }}
      onMouseDown={() => setIsCapture(true)}
      onDragStart={() => setIsCapture(true)}
      onDragMove={(e) => {
        const x = e.target.x();
        let bpPos = x2bpPos(x + dragOffset[0]);
        setRightCaptureControllerX2(contigX + (bpPos - start + 1) * widthPerBp);
        setEnd(bpPos);
      }}
      onDragEnd={() => {
        setIsCapture(false);
        setRightCaptureControllerX(contigX + (end - start + 1) * widthPerBp);
        setRightCaptureControllerX2(contigX + (end - start + 1) * widthPerBp);
        setCursor("default");
      }}
    />
  );

  const LeftInVisiableRect = (
    <Group opacity={isHover || isCapture ? 0.8 : 0}>
      <Line
        points={[
          contigX - 1,
          contigY + 1,
          contigX - (start - 1) * widthPerBp,
          contigY + 1,
        ]}
        dash={[5, 0, 5]}
        stroke="black"
        strokeWidth={0.5}
      />
      <Line
        points={[
          contigX - 1,
          contigY + thickness - 1,
          contigX - (start - 1) * widthPerBp,
          contigY + thickness - 1,
        ]}
        dash={[5, 0, 5]}
        stroke="black"
        strokeWidth={0.5}
      />
      <Rect
        x={contigX - (start - 1) * widthPerBp}
        y={contigY}
        width={(start - 1) * widthPerBp}
        fill="#eee"
        // stroke="#000"
        // dash={[5, thickness]}
        lineCap="butt"
        opacity={0.5}
        height={thickness}
      />
    </Group>
  );

  const RightInVisiableRect = (
    <Group opacity={isHover || isCapture ? 0.8 : 0}>
      <Line
        points={[
          rightCaptureControllerX2 + 1,
          contigY + 1,
          rightCaptureControllerX2 + (length - end + 1) * widthPerBp,
          contigY + 1,
        ]}
        dash={[5, 0, 5]}
        stroke="black"
        strokeWidth={0.5}
      />
      <Line
        points={[
          rightCaptureControllerX2 + 1,
          contigY + thickness - 1,
          rightCaptureControllerX2 + (length - end + 1) * widthPerBp,
          contigY + thickness - 1,
        ]}
        dash={[5, 0, 5]}
        stroke="black"
        strokeWidth={0.5}
      />
      <Rect
        x={rightCaptureControllerX2}
        y={contigY}
        width={(length - end + 1) * widthPerBp}
        fill="#eee"
        lineCap="butt"
        opacity={0.5}
        height={thickness}
      />
    </Group>
  );

  const TickJSX =
    isHover || isCapture || tick === TickMode.ShowWhole ? (
      <Tick
        x={contigX - (start - 1) * widthPerBp}
        y={contigY}
        tickDirection={TickDirection.Up}
        start={1}
        end={length}
        widthPerBp={widthPerBp}
        showLabel
        labelOffset={tickLabelOffset}
        labelRotation={tickLabelRotation}
      />
    ) : (
      <Tick
        x={contigX}
        y={contigY}
        tickDirection={TickDirection.Up}
        // tickUnit={20}
        start={start}
        end={end}
        widthPerBp={widthPerBp}
        showLabel
        labelOffset={tickLabelOffset}
        labelRotation={tickLabelRotation}
      />
    );
  return (
    <Group
      draggable={draggable}
      onDragEnd={(e) => {
        if (e.target.nodeType !== "Group") {
          return;
        }
        setDragOffset([e.target.attrs.x, e.target.attrs.y]);
      }}
    >
      <Rect
        x={contigX}
        y={contigY}
        width={contigWidth}
        fill="#fff"
        stroke="#000"
        opacity={0.5}
        height={thickness}
        // brightness
        onMouseOver={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
      />
      {TickJSX}
      {LeftInVisiableRect}
      {RightInVisiableRect}
      {LeftCaptureController}
      {RightCaptureController}
    </Group>
  );
});

export default Contig;

export const useCaptureContig = (options: {
  length?: number;
  start?: number;
  end?: number;
  width: number;
  coor?: [x: number, y: number];
}) => {
  const {
    length = MAX_CONTIG_LENGTH,
    start: initStart = 1,
    end: initEnd = length,
    width,
    coor = [0, 0],
  } = options;
  const [interval, setInterval] = useState<[start: number, end: number]>([
    initStart,
    initEnd,
  ]);

  // const initVisibleInterval = useMemo()
  const onCapture = useCallback((start: number, end: number) => {
    setInterval([Math.round(start), Math.round(end)]);
  }, []);

  const CaptureContigJSX = useMemo(
    () => (
      <>
        <Rect
          width={10}
          height={10}
          fill="red"
          onClick={() => {
            setInterval([100000000, 500000000]);
          }}
        />
        <Contig
          coor={coor}
          draggable={false}
          length={length}
          visibleInterval={interval}
          alignToInitX={false}
          canCapture
          onCapture={onCapture}
          widthPerBp={width / (initEnd - initStart + 1)}
          tick={TickMode.ShowWhole}
          tickLabelOffset={[15, 10]}
          tickLabelRotation={-15}
        />
      </>
    ),
    []
  );

  return [CaptureContigJSX, interval, setInterval] as [
    JSX.Element,
    [start: number, end: number],
    React.Dispatch<React.SetStateAction<[start: number, end: number]>>
  ];
};
