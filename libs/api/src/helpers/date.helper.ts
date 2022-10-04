/**
 * Converts date to unix timestamp
 */
export function getUnixTimestamp(date: Date) {
  return (date.getTime() / 1000) | 0;
}

/**
 * Returns UTC date without time
 */
export function getDateWithoutTimeUTC(timestamp = Date.now()) {
  return new Date(new Date(timestamp).setUTCHours(0, 0, 0, 0));
}
