import { useState, useCallback, useRef, useEffect } from "react";
import { Modal, Upload, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import {
  Alignment,
  AlignmentsByCtgs,
  alignParserFromContent,
  AlignType,
} from "@linkview/linkview-align-parser";
import { alignTypeMap } from "@/constants/alignType";
import { formatCount } from "@/utils/format";
// import { RcFile } from 'rc-upload/lib/interface';
import { useStores } from "@/store";
import style from "./ImportModal.module.scss";
import { Custom } from "@/constants/sourceType";

export enum ImportType {
  Alignments,
  Gff,
}
interface IProps {
  importType: ImportType;
  onClose: () => void;
  open: boolean;
}

const { Dragger } = Upload;

const ImportModal = (props: IProps) => {
  const { importType, onClose, open } = props;
  const { alignmentsStore, fileStore, contigStore } = useStores();
  const { alignFileNames, setAlignFileNames } = fileStore;
  const { addAlignments, addAlignmentsByCtgs } = alignmentsStore;
  const { addLen, addReleatedAlignFile } = contigStore;
  const fileNamesRef = useRef<Set<string>>(new Set(alignFileNames));
  const source2AlignmentsRef = useRef<Record<string, Alignment[]>>({});
  const source2AlignmentsByCtgsRef = useRef<Record<string, AlignmentsByCtgs>>(
    {}
  );
  const lenInfoRef = useRef<Record<string, number>>({});
  const contigsByAlignFileRef = useRef<Record<string, string[]>>({});
  // 用于重新渲染 Dragger 组件 （清空 fileList 列表）
  const [key, setKey] = useState(0);
  const getFileName = (fileName: string) => {
    if (!fileNamesRef.current.has(fileName)) {
      return fileName;
    }
    let i = 1;
    while (fileNamesRef.current.has(`${fileName}(${i})`)) {
      i++;
    }
    return `${fileName}(${i})`;
  };
  const handleOk = () => {
    setAlignFileNames(fileNamesRef.current);
    for (const fileName in source2AlignmentsRef.current) {
      const alignments = source2AlignmentsRef.current[fileName];
      const alignmentsByCtgs = source2AlignmentsByCtgsRef.current[fileName];
      addAlignments(alignments, fileName);
      addAlignmentsByCtgs(alignmentsByCtgs, fileName);

      const contigNames = contigsByAlignFileRef.current[fileName];
      for (const contigName of contigNames) {
        const length = lenInfoRef.current[contigName];
        addLen(contigName, lenInfoRef.current[contigName]);
        addReleatedAlignFile(contigName, fileName);
      }
    }

    source2AlignmentsRef.current = {};
    source2AlignmentsByCtgsRef.current = {};
    lenInfoRef.current = {};
    contigsByAlignFileRef.current = {};
    setKey(key + 1);
    onClose();
  };

  useEffect(() => {
    fileNamesRef.current = new Set(alignFileNames);
  }, [alignFileNames]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="导入"
      cancelText="取消"
      title={`从文件中导入${
        importType === ImportType.Alignments ? "比对" : "基因"
      }`}
    >
      <Dragger
        key={key}
        beforeUpload={(file) => {}}
        itemRender={(originNode, file, fileList, { remove }) => {
          // @ts-ignore
          const { fileName, alignType, alignCount } = file;
          return (
            <div
              className={`${style.uploadFileItem} ${
                alignType ? "" : style.error
              }`}
            >
              <div className={style.infoWarp}>
                <div className={style.fileName}>{fileName}</div>
                <div className={style.alignType}>{alignType || "未知格式"}</div>
                {alignCount && (
                  <div className={style.alignCount}>{`${formatCount(
                    alignCount
                  )} 条比对`}</div>
                )}
              </div>
              <DeleteOutlined
                className={style.delete}
                onClick={() => {
                  source2AlignmentsRef.current[fileName!] = [];
                  source2AlignmentsByCtgsRef.current[fileName!] = {};
                  fileNamesRef.current.delete(fileName!);
                  remove();
                }}
              />
            </div>
          );
        }}
        customRequest={({ file, onError, onSuccess }) => {
          var fr = new FileReader();
          fr.readAsText(file as File);
          fr.addEventListener(
            "loadend",
            (e) => {
              try {
                const content = e.target!.result;
                const { alignType, alignments, alignmentsByCtgs, lenInfo } =
                  alignParserFromContent(content as string);
                // @ts-ignore
                file.alignType = alignTypeMap[alignType];
                // @ts-ignore
                file.alignCount = alignments.length;
                const fileName = getFileName((file as File).name);
                fileNamesRef.current.add(fileName);
                source2AlignmentsRef.current[fileName] = alignments;
                source2AlignmentsByCtgsRef.current[fileName] = alignmentsByCtgs;
                // @ts-ignore
                file.fileName = fileName;
                const contigs = Object.keys(alignmentsByCtgs);
                contigsByAlignFileRef.current[fileName] = contigs;
                lenInfoRef.current = { ...lenInfoRef.current, ...lenInfo };
                // @ts-ignore
                onSuccess();
              } catch {
                // @ts-ignore
                onError();
              }
            },
            false
          );
        }}
      >
        点击此处或将文件拖拽至此
      </Dragger>
    </Modal>
  );
};

export default observer(ImportModal);
