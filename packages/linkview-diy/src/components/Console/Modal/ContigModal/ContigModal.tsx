import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Modal, Upload, Table, Popover, Input } from "antd";
import { ColumnsType } from "antd/lib/table";
import { FilterFilled, ImportOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import { formatCount } from "@/utils/format";
// import { RcFile } from 'rc-upload/lib/interface';
import { useStores } from "@/store";
import AddCtgToCanvasModal from "./AddCtgToCanvasModal";
import style from "./ContigModal.module.scss";

interface IProps {
  onClose: () => void;
  open: boolean;
}

export interface ContigInfo {
  key: string;
  contigName: string;
  alignCount: number;
  length?: number | undefined;
  releatedAlignFiles?: string[] | undefined;
  isCusTomer?: boolean | undefined;
}

const ImportModal = (props: IProps) => {
  const { onClose, open } = props;
  const [editLengthContigName, setEditLengthContigName] = useState("");
  const [searchContig, setSearchContig] = useState("");
  const [addCtgToCanvasModalOpen, setAddCtgToCanvasModalOpen] = useState(false);
  const [curContigInfo, setCurContigInfo] = useState<ContigInfo>({
    contigName: "",
    alignCount: 0,
    key: "",
  });
  const { alignmentsStore, fileStore, contigStore } = useStores();
  const { contigMap, addLen } = contigStore;
  const { source2alignmentsByCtgs } = alignmentsStore;
  const { alignFileNames } = fileStore;

  const contigNames = Object.keys(contigMap);
  const calculateAlignCount = useCallback(
    (contigName: string) => {
      return [...alignFileNames].reduce((pre, cur) => {
        const alignmentsMap =
          source2alignmentsByCtgs?.[cur]?.[contigName] || {};
        const alignmentCount = Object.keys(alignmentsMap).reduce(
          (pre, contig) => pre + alignmentsMap[contig].length,
          0
        );
        return pre + alignmentCount;
      }, 0);
    },
    [source2alignmentsByCtgs]
  );

  const dataSource: ContigInfo[] = useMemo(() => {
    return contigNames
      .filter((contigName) => contigName.includes(searchContig))
      .map((contigName) => ({
        key: contigName,
        contigName,
        alignCount: calculateAlignCount(contigName),
        ...contigMap[contigName],
      }));
  }, [contigNames, searchContig]);

  const columns: ColumnsType<ContigInfo> = [
    {
      dataIndex: "contigName",
      key: "contigName",
      render: (val, record) => (
        <ImportOutlined
          className={style.importIcon}
          onClick={() => {
            setAddCtgToCanvasModalOpen(true);
            setCurContigInfo(record);
          }}
        />
      ),
      width: 42,
    },
    {
      title: "序列名",
      dataIndex: "contigName",
      key: "contigName",
      filterDropdown: () => (
        <Input
          value={searchContig}
          placeholder="搜索序列"
          onChange={(e) => {
            setSearchContig(e.target.value);
          }}
        />
      ),
      filterIcon: (
        <FilterFilled
          style={searchContig.length > 0 ? { color: "#1677ff" } : {}}
        />
      ),
    },
    {
      title: "长度 (bp)",
      dataIndex: "length",
      key: "length",
      render: (length: number | undefined, record) => {
        const { contigName } = record;
        if (editLengthContigName === contigName) {
          return (
            <Input
              className={style.lengthInput}
              onBlur={() => setEditLengthContigName("")}
              defaultValue={contigMap[contigName].length}
              onChange={(e) => {
                addLen(contigName, Number(e.target.value));
              }}
              autoFocus
            />
          );
        }
        return (
          <div
            className={style.lengthContainer}
            onClick={() => setEditLengthContigName(contigName)}
          >
            {length ? formatCount(length) : ""}
          </div>
        );
      },
      sorter: (a, b) => (a.length || 0) - (b.length || 0),
      showSorterTooltip: { title: "点击按长度（取消）排序" },
    },
    {
      title: "比对数",
      dataIndex: "alignCount",
      key: "alignCount",
      render: (alignCount: number) => formatCount(alignCount),
      sorter: (a, b) => (a.alignCount || 0) - (b.alignCount || 0),
      showSorterTooltip: { title: "点击按比对数（取消）排序" },
    },
    {
      title: "关联文件",
      dataIndex: "releatedAlignFiles",
      key: "releatedAlignFiles",
      render: (releatedAlignFiles: string[]) => {
        const filesStr = releatedAlignFiles.join(", ");

        return (
          <Popover
            placement="right"
            content={releatedAlignFiles.map((releatedAlignFile) => (
              <div>{releatedAlignFile}</div>
            ))}
          >
            <div className={style.releatedAlignFiles}>{filesStr}</div>
          </Popover>
        );
      },
    },
  ];

  return (
    <Modal
      width={1000}
      open={open}
      onCancel={onClose}
      footer={null}
      title="序列管理"
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ y: 240 }}
      />
      <AddCtgToCanvasModal
        open={addCtgToCanvasModalOpen}
        onClose={() => setAddCtgToCanvasModalOpen(false)}
        contigInfo={curContigInfo}
      />
    </Modal>
  );
};

export default observer(ImportModal);
