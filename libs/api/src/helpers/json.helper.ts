import { JSONObject } from '@app-libs/api';

/**
 * Tries to parse json string, otherwise return given value itself
 */
export function tryParseJSON(value: string): JSONObject | string {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

/**
 * Removes undefined properties which were explicitly defined
 */
export function normalize<T>(plainObject: T): T {
  return JSON.parse(JSON.stringify(plainObject));
}
