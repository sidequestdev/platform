import fs from "node:fs/promises";
import { instanceOfNodeError } from "./type-guards/node-error";

/**
 * Read a directory and not throw on permission errors.
 * @param path
 * @returns
 */
export async function safeReadDir(path: string) {
  let dirData: string[] = [];

  try {
    dirData = await fs.readdir(path);
  } catch (error) {
    const isNodeError = instanceOfNodeError(error, TypeError);

    if (isNodeError && (error.code == "EACCES" || error.code == "EPERM")) {
      // User does not have permissions, ignore directory
      return null;
    } else {
      throw error;
    }
  }

  return dirData;
}
