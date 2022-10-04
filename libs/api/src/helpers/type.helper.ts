/**
 * Checks if the variable has given type based on existence of specific property.
 * @see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 */
export function isType<T>(
  variable: any,
  propertyToCheckFor: keyof T,
): variable is T {
  return (variable as T)?.[propertyToCheckFor] !== undefined;
}

/**
 * Checks if the variable has type of plain Object
 */
export function isPlainObject(variable: any): boolean {
  return variable?.constructor == Object;
}
