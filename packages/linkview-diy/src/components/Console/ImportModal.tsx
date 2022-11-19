import { Modal } from 'antd';

export enum ImportType {
  Alignments,
  Gff,
}
interface IProps {
  importType: ImportType,
  open: boolean,
}

const ImportModal = (props: IProps) => {
  const {importType, open} = props;
  return <Modal open={open}>导入文件</Modal>;
};

export default ImportModal;
