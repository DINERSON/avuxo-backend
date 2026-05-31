export function nowIso(): string {
  return new Date().toISOString();
}

export function toNumber(value: any, fallback = 0): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

export function getRideId(body: any): number | null {
  const value =
    body?.rideId ??
    body?.id ??
    body?._id;

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
}

export function imageOrFallback(value: any, fallback: string): string {
  const text = String(value || '').trim();

  if (!text) return fallback;

  return text;
}

export function fileOrEmpty(value: any): string {
  const text = String(value || '').trim();

  if (!text) return '';

  return text;
}

export function isPdfFile(value: any): boolean {
  const text = String(value || '').toLowerCase();

  return (
    text.startsWith('data:application/pdf') ||
    text.includes('application/pdf') ||
    text.endsWith('.pdf')
  );
}