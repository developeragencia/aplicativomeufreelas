import type { ReactNode } from 'react';

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  footer?: ReactNode;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  footer,
}: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="bg-white w-full max-w-sm rounded shadow p-5">
        <h3 id="confirm-title" className="text-gray-800 font-semibold mb-3">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        {footer}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 text-sm">{cancelText}</button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white text-sm">{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
