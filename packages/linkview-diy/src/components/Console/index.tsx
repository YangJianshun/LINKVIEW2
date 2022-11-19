import { useState, useCallback, useRef } from "react";
import { FloatButton, Dropdown } from "antd";
import { SettingOutlined, DownloadOutlined } from "@ant-design/icons";
import style from "./index.module.scss";
import { throttle } from "lodash";
import ImportModal, { ImportType } from "./ImportModal";

const INIT_COOR = [50, 50];

const Console = () => {
  const [isDrag, setIsDrag] = useState(false);
  // 由于 antd 5 的 FloatButton open 不够完善，只能用比较 hack 的方式
  const lockFloatButtonRef = useRef(false);
  const [coor, serCoor] = useState(INIT_COOR);

  const offsetCoorRef = useRef([0, 0]);
  const handleMouseDown = useCallback(
    ({ pageX, pageY }: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      
      setIsDrag(true);
      const [x, y] = coor;
      offsetCoorRef.current = [pageX - x, pageY - y];
    },
    [coor]
  );
  const handleMouseUp = useCallback(() => {
      setIsDrag(false);
      if (lockFloatButtonRef.current)
        setTimeout(() => (lockFloatButtonRef.current = false), 500);
  }, []);
  const handleMouseMove = useCallback(
    throttle(
      ({ pageX, pageY }: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!isDrag) return;
        const [offsetX, offsetY] = offsetCoorRef.current;
        const x = pageX - offsetX > 0 ? pageX - offsetX : 0;
        const y = pageY - offsetY > 0 ? pageY - offsetY : 0;
        serCoor([x, y]);
        if (!lockFloatButtonRef.current) lockFloatButtonRef.current = true;
      },
      200,
      {}
    ),
    [isDrag, coor]
  );
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(lockFloatButtonRef.current);
    if (lockFloatButtonRef.current) e.stopPropagation();
  }, [isDrag]);

  const [x, y] = coor;
  return (
    <div
      onMouseDownCapture={handleMouseDown}
      onMouseUpCapture={handleMouseUp}
      onMouseMoveCapture={handleMouseMove}
      onClickCapture={handleClick}
      className={style.floatBtnContainer}
      style={{ left: x, top: y }}>
      <FloatButton.Group
        className={`${style.floatBtn} ${isDrag ? style.floatBtnDrag : ""} `}
        icon={<SettingOutlined />}
        trigger="click"
        onClick={() => console.log("open")}
        shape="square">
        {/* <FloatButton description="导入" tooltip={!isDrag && "导入文件"}/> */}
        <Dropdown
          menu={{items: [
            { label: <div>导入 alignments 文件</div>, key: "align_import" },
            { label: <div>导入 gff 文件</div>, key: "gff_import" },
          ]}}
          placement='topRight'
        >
          <FloatButton
          description="导入"
        />
          </Dropdown>
        <FloatButton
          description="比对"
          tooltip={!isDrag && "alignments 管理"}
        />
        <FloatButton description="序列" tooltip={!isDrag && "序列管理"} />
        <FloatButton description="基因" tooltip={!isDrag && "gene 管理"} />
        <FloatButton description="图例" tooltip={!isDrag && "图例"} />
        <FloatButton description="保存" tooltip={!isDrag && "保存"} />
      </FloatButton.Group>
      {isDrag ? <div className={style.mask}></div> : null}
      {/* <ImportModal importType={ImportType.Alignments} open={true} /> */}
    </div>
  );
};

export default Console;
