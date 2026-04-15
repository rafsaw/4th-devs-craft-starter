/**
 * Format a Date as ISO-8601 / RFC 3339 using the host's local wall clock and UTC offset
 * (e.g. `2026-04-07T20:51:17.665-05:00`), not `Z` (UTC).
 *
 * @param {Date} [date]
 * @returns {string}
 */
export function formatLocalDateTime(date = new Date()) {
  const pad2 = (n) => String(n).padStart(2, "0");
  const pad3 = (n) => String(n).padStart(3, "0");

  const y = date.getFullYear();
  const mo = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  const h = pad2(date.getHours());
  const mi = pad2(date.getMinutes());
  const s = pad2(date.getSeconds());
  const ms = pad3(date.getMilliseconds());

  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const oh = pad2(Math.floor(abs / 60));
  const om = pad2(abs % 60);

  return `${y}-${mo}-${d}T${h}:${mi}:${s}.${ms}${sign}${oh}:${om}`;
}
