import { isPlainObject } from '@app-libs/api';

/**
 * Serializes parameters object to query string
 */
export function serializeParameters(params: Record<string, unknown>) {
  return new URLSearchParams(
    Object.entries(params)
      .map(([k, v]) => {
        if (
          isPlainObject(v) ||
          (Array.isArray(v) && v.find((item) => isPlainObject(item)) != null)
        ) {
          return null;
        }

        return [k, v.toString()];
      })
      .filter((v) => v != null),
  ).toString();
}
