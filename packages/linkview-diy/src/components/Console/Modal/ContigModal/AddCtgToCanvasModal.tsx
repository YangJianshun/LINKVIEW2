import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  Modal,
  Upload,
  Table,
  Form,
  Input,
  // notification,
  message,
  type InputRef,
} from "antd";
import { Stage, Layer, Rect } from "react-konva";
import { observer } from "mobx-react";
import Contig, {
  MAX_CONTIG_LENGTH,
  TickMode,
} from "@/components/CanvasElements/Contig/Contig";
import { type ContigInfo } from "./ContigModal";
import { useStores } from "@/store";
import style from "./AddCtgToCanvasModal.module.scss";
import { formatBpPos } from "@/utils/format";
import { parseBpPos } from "@/utils/parse";

interface IProps {
  onClose: () => void;
  contigInfo: ContigInfo;
  open: boolean;
}

const AddCtgToCanvasModal = (props: IProps) => {
  const { open, onClose, contigInfo } = props;
  const { styleStore } = useStores();
  const { cursor } = styleStore;
  const { length = MAX_CONTIG_LENGTH, contigName } = contigInfo;
  // const initStart = 1;
  // const initEnd = length;

  const [visibleInterval, setVisibleInterval] = useState<
    [start: number, end: number]
  >([1, length]);
  const [interval, setInterval] = useState<[start: number, end: number]>([
    1,
    length,
  ]);
  const [start, end] = interval;
  const startInputRef = useRef<InputRef>(null);
  const endInputRef = useRef<InputRef>(null);
  const [isEditStart, setIsEditStart] = useState(false);
  const [startStr, setStartStr] = useState(`${start}`);
  const [isEditEnd, setIsEditEnd] = useState(false);
  const [endStr, setEndStr] = useState(`${end}`);
  const [originStart, setOriginStart] = useState(1);
  useEffect(() => {
    setOriginStart(1);
    setVisibleInterval([1, length]);
    setInterval([1, length]);
  }, [contigName, length]);

  return (
    <Modal
      key={contigName}
      width={1000}
      open={open}
      onCancel={onClose}
      okText="添加到画布"
      cancelText="取消"
      title="添加序列到画布"
    >
      <div className={style.form}>
        <Form.Item label="起始位置" className={style.formItem}>
          <div
            className={`${style.iputBoxFake} ${style.iputBox} ${
              isEditStart ? style.isEdit : ""
            }`}
            onClick={() => {
              setStartStr(formatBpPos({ bpPos: start, suffix: "bp" }));
              setIsEditStart(true);
              setTimeout(
                () => startInputRef.current?.focus({ cursor: "all" }),
                100
              );
            }}
          >
            {formatBpPos({ bpPos: start, suffix: "bp" })}
          </div>
          <Input
            className={`${style.iputBox} ${style.iputBoxReal} ${
              isEditStart ? style.isEdit : ""
            }`}
            value={startStr}
            ref={startInputRef}
            onChange={(e) => {
              setStartStr(e.target.value);
            }}
            onBlur={(e) => {
              const parsedVal = parseBpPos(e.target.value);
              if (parsedVal) {
                let newStart = parsedVal;
                if (newStart < 1) {
                  newStart = 1;
                  message.warning("起始位置不能小于1");
                } else if (newStart > end) {
                  newStart = end - 1;
                  message.warning("起始位置不能超过结束位置");
                } else if (newStart > length - 1) {
                  newStart = length - 1;
                  message.warning("起始位置不能大于等于序列长度");
                }
                setInterval([newStart, end]);
                setVisibleInterval([newStart, end]);
              } else {
                message.error(`“${e.target.value}” 无法正确解析为物理位置`);
              }
              setIsEditStart(false);
            }}
          />
        </Form.Item>
        <Form.Item label="结束位置" className={style.formItem}>
          <div
            className={`${style.iputBoxFake} ${style.iputBox} ${
              isEditEnd ? style.isEdit : ""
            }`}
            onClick={() => {
              setEndStr(formatBpPos({ bpPos: end, suffix: "bp" }));
              setIsEditEnd(true);
              setTimeout(
                () => endInputRef.current?.focus({ cursor: "all" }),
                100
              );
            }}
          >
            {formatBpPos({ bpPos: end, suffix: "bp" })}
          </div>
          <Input
            className={`${style.iputBox} ${style.iputBoxReal} ${
              isEditEnd ? style.isEdit : ""
            }`}
            value={endStr}
            ref={endInputRef}
            onChange={(e) => {
              setEndStr(e.target.value);
            }}
            onBlur={(e) => {
              const parsedVal = parseBpPos(e.target.value);
              if (parsedVal) {
                let newEnd = parsedVal;
                if (newEnd < 2) {
                  newEnd = 2;
                  message.warning("结束位置不能小于2");
                } else if (newEnd < start + 1) {
                  newEnd = start + 1;
                  message.warning("结束位置小于等于起始位置");
                } else if (newEnd > length) {
                  newEnd = length;
                  message.warning("结束位置不能超过序列长度");
                }
                setInterval([start, newEnd]);
                setVisibleInterval([start, newEnd]);
              } else {
                message.error(`“${e.target.value}” 无法正确解析为物理位置`);
              }
              setIsEditEnd(false);
            }}
          />
        </Form.Item>
      </div>
      <Stage
        className={style.stage}
        width={1000}
        height={200}
        style={{ cursor }}
      >
        <Layer>
          <Contig
            contigName={contigName}
            coor={[25, 30]}
            canCapture
            draggable={false}
            onCapture={(start, end) => {
              setInterval([Math.round(start), Math.round(end)]);
            }}
            length={length}
            visibleInterval={visibleInterval}
            widthPerBp={900 / length}
            alignToInitX={false}
            originStart={originStart}
            tick={TickMode.ShowWhole}
            tickLabelOffset={[15, 10]}
            tickLabelRotation={-15}
          />
        </Layer>
      </Stage>
    </Modal>
  );
};

export default observer(AddCtgToCanvasModal);
