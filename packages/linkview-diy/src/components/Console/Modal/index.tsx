import ImportModal, { ImportType } from "./ImportModal/ImportModal";
import ContigModal from "./ContigModal/ContigModal";

export enum ModalType {
  ImportAlignment = 1,
  ImportGff,
  Contig,
}

interface IProps {
  modalType: ModalType | null;
  onClose: () => void;
}

const Modal = ({ modalType, onClose }: IProps) => {
  return (
    <>
      <ImportModal
        importType={ImportType.Alignments}
        onClose={onClose}
        open={modalType === ModalType.ImportAlignment}
      />
      <ImportModal
        importType={ImportType.Gff}
        onClose={onClose}
        open={modalType === ModalType.ImportGff}
      />
      <ContigModal onClose={onClose} open={modalType === ModalType.Contig} />
    </>
  );
};

export default Modal;
