type ToastProps = {
  open: boolean;
  message: string;
  variant?: 'success' | 'error' | 'info';
};

export default function Toast({ open, message, variant = 'info' }: ToastProps) {
  if (!open) return null;
  const base = 'fixed top-4 right-4 text-sm px-4 py-2 rounded shadow z-50';
  const color =
    variant === 'success' ? 'bg-green-600 text-white' :
    variant === 'error' ? 'bg-red-600 text-white' :
    'bg-gray-800 text-white';
  return <div className={`${base} ${color}`} role="status" aria-live="polite">{message}</div>;
}
