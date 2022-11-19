import ImportModal, { ImportType } from "./ImportModal";

export enum ModalType {
  ImportAlignment = 1,
  ImportGff,
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
    </>
  );
};

export default Modal;
