/**
 * Converts SELECT to DELETE SQL query
 */
export function toDeleteQuery(query: string) {
  let newQuery = query.replace(/^select.*from/gi, 'DELETE FROM');
  const regexp = /^DELETE FROM\s+`?\w+`?\s+(`?\w+`?)\s+WHERE/gi;
  const alias = regexp.exec(newQuery)?.[1];

  if (alias) {
    newQuery = newQuery.replace(
      new RegExp(`(${alias}\s|${alias}\.)`, 'gi'),
      '',
    );
  }

  return newQuery;
}
