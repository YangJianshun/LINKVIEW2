import { Modal } from 'antd';

export enum ImportType {
  Alignments,
  Gff,
}
interface IProps {
  importType: ImportType,
  onClose: () => void,
  open: boolean,
}

const ImportModal = (props: IProps) => {
  const { importType, onClose, open } = props;
  return (
    <Modal
      open={open}
      onCancel={onClose}
      okText="导入"
      cancelText="取消"
      title={`从文件中导入${importType === ImportType.Alignments ? "比对" : "基因"}`}
      >
      导入 {importType === ImportType.Alignments ? "align" : "gff"} 文件
    </Modal>
  );
};

export default ImportModal;
