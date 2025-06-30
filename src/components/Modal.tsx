import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: ReactNode | undefined;
  "aria-labelledby"?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  "aria-labelledby": labelledby,
}: ModalProps) {
  const { t } = useTranslation();

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="z-100 relative bg-white w-full max-w-md p-6 rounded-lg shadow-xl"
      overlayClassName="z-100 fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4"
      shouldFocusAfterRender={false}
      aria={{
        labelledby: labelledby,
      }}
    >
      {onClose && (
        <button type="button" onClick={onClose} className="sr-only">
          {t("close")}
        </button>
      )}
      {children}
    </ReactModal>
  );
}
