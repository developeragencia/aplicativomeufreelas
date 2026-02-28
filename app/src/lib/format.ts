export function formatCurrencyBRL(value: string): { formatted: string; numeric: number } {
  const digits = value.replace(/\D+/g, '');
  const int = digits ? parseInt(digits, 10) : 0;
  const numeric = int / 100;
  const formatted = numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return { formatted, numeric };
}

export function maskCurrencyBRLInput(value: string): string {
  return formatCurrencyBRL(value).formatted;
}

export function maskDateDDMMYYYY(value: string): string {
  const digits = value.replace(/\D+/g, '').slice(0, 8);
  const parts = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));
  return parts.join('/');
}
