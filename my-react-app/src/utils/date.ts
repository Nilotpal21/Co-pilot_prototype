export function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') return new Date(value);
  // last resort
  return new Date(String(value));
}

export function formatLocaleDate(value: unknown): string {
  const d = toDate(value);
  // Guard invalid dates
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString();
}


