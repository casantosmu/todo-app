import type { ReactNode } from "react";
import ReactModal from "react-modal";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: ReactNode | undefined;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-xl"
      overlayClassName="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4"
    >
      {children}
    </ReactModal>
  );
}
