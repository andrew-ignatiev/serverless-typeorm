/**
 * Intersects two arrays and makes values unique
 */
export function intersect<T>(a: T[], b: T[]) {
  const setB = new Set(b);
  return unique(a).filter((x) => setB.has(x));
}

/**
 * Returns unique array
 */
export function unique<T>(a: T[]) {
  return [...new Set(a)];
}
