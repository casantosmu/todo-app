import { X } from "lucide-react";
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
      className="z-100 relative bg-white w-full max-w-md p-6 rounded-lg shadow-xl focus:outline-none"
      overlayClassName="z-100 fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4"
      shouldFocusAfterRender={true}
      aria={{
        labelledby: labelledby,
      }}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="
            absolute top-3 right-3 p-1 rounded-full text-gray-500
            opacity-70 transition-all duration-150 ease-in-out
            hover:opacity-100 hover:bg-gray-100
            focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
          "
        >
          <X className="h-5 w-5" />
        </button>
      )}
      {children}
    </ReactModal>
  );
}
