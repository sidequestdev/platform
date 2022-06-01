/**
 * Normalizes windows style paths by replacing double backslashes with
 * single forward slashes (unix style).
 */
export function normalizePath(path: string) {
  return path.replace(/\\/g, "/");
}
