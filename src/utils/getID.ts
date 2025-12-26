const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Returns how many whole days have passed since Dec 31, 2025.
 * - Dec 31, 2025 => 0
 * - Jan 01, 2026 => 1
 * Negative values mean the date is before Dec 31, 2025.
 */
export function getID(now: Date = new Date()): number {
  const startUtcMs = Date.UTC(2025, 11, 31); // Months are 0-based; 11 = December
  const nowUtcMs = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  return Math.floor((nowUtcMs - startUtcMs) / MS_PER_DAY);
}
