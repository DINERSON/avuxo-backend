export function nowIso(): string {
  return new Date().toISOString();
}

export function toNumber(
  value: any,
  fallback = 0,
): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

export function getRideId(
  body: any,
): string | null {
  const rideId = rideKey(body);

  return rideId.length > 0
    ? rideId
    : null;
}

export function imageOrFallback(
  value: any,
  fallback: string,
): string {
  const text = String(value || '').trim();

  return text || fallback;
}

export function fileOrEmpty(
  value: any,
): string {
  return String(value || '').trim();
}

export function isPdfFile(
  value: any,
): boolean {
  const text = String(value || '').toLowerCase();

  return (
    text.startsWith('data:application/pdf') ||
    text.includes('application/pdf') ||
    text.endsWith('.pdf')
  );
}

export function rideKey(
  value: any,
): string {
  if (
    value &&
    typeof value === 'object'
  ) {
    return String(
      value.rideId ||
      value.ride_id ||
      value.id ||
      value._id ||
      value.ride?.rideId ||
      value.ride?.id ||
      '',
    ).trim();
  }

  return String(value || '').trim();
}