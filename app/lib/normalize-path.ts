/**
 * Normalizes windows style paths by replacing double backslahes with
 * single forward slahes (unix style).
 */
export function normalizePath(path: string) {
  return path.replace(/\\/g, "/");
}
