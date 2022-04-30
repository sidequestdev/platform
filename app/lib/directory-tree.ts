import type { Stats } from "node:fs";
import fs from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { normalizePath } from "./normalize-path";
import { safeReadDir } from "./safe-read-dir";

const FileType = {
  DIRECTORY: "directory",
  FILE: "file",
} as const;

type ExtendedStats = Stats & {
  extension: string;
  type: typeof FileType.FILE | typeof FileType.DIRECTORY;
};

// Remove functions
type Attribute =
  | {
      [K in keyof ExtendedStats]: ExtendedStats[K] extends Function ? never : K;
    }[keyof ExtendedStats];

interface DirectoryTreeOptions {
  attributes?: ReadonlyArray<Attribute>;
  depth?: number;
  exclude?: RegExp | RegExp[];
  extensions?: RegExp;
  followSymlinks?: boolean;
  normalizePath?: boolean;
  symlinks?: number[];
}

type DirectoryTreeOptionsWithoutAttributes = Omit<
  DirectoryTreeOptions,
  "attributes"
>;

type DirectoryTreeOptionsWithAttributes = Omit<
  DirectoryTreeOptions,
  "attributes"
> & {
  attributes: NonNullable<DirectoryTreeOptions["attributes"]>;
};

type BaseDirectoryEntry = {
  path: string;
  name: string;
  size: number;
  isSymbolicLink?: boolean;
};

type File = {
  type: typeof FileType["FILE"];
  extension: string;

  [key: string]: any;
};

type Directory = {
  type: typeof FileType["DIRECTORY"];
  children: DirectoryEntry[];

  [key: string]: any;
};

type DirectoryEntry = BaseDirectoryEntry &
  (File | Directory | { type?: never });

const isFile = (
  stats: Stats,
  _entry: DirectoryEntry
): _entry is BaseDirectoryEntry & File => stats.isFile();

const isDirectory = (
  stats: Stats,
  _entry: DirectoryEntry
): _entry is BaseDirectoryEntry & Directory => stats.isFile();

/**
 * Collects the files and folders for a directory path into an Object, subject
 * to the options supplied, and invoking optional
 */
export async function directoryTree<
  Options extends DirectoryTreeOptionsWithAttributes
>(
  path: string,
  options: Options,
  currentDepth?: number
): Promise<
  | (DirectoryEntry & {
      [key in typeof options["attributes"][number]]: ExtendedStats[key];
    })
  | null
>;
export async function directoryTree<
  Options extends DirectoryTreeOptionsWithoutAttributes
>(
  path: string,
  options?: Options,
  currentDepth?: number
): Promise<DirectoryEntry | null>;
export async function directoryTree<Options extends DirectoryTreeOptions>(
  path: string,
  options: Options,
  currentDepth = 0
) {
  if (
    options.depth !== undefined &&
    options.attributes?.indexOf("size") !== -1
  ) {
    throw new Error("usage of size attribute with depth option is prohibited");
  }

  const name = basename(path);
  path = options.normalizePath ? normalizePath(path) : path;
  const item: BaseDirectoryEntry = {
    name,
    path,
    size: 0,
  };
  let stats: Stats;
  let lstat: Stats;

  try {
    stats = await fs.stat(path);
    lstat = await fs.lstat(path);
  } catch (e) {
    return null;
  }

  // Skip if it matches the exclude regex
  if (options.exclude) {
    const excludes = Array.isArray(options.exclude)
      ? options.exclude
      : [options.exclude];

    if (excludes.some((exclusion) => exclusion.test(path))) {
      return null;
    }
  }

  if (lstat.isSymbolicLink()) {
    item.isSymbolicLink = true;
    // Skip if symbolic links should not be followed
    if (options.followSymlinks === false) return null;

    // Initialize the symbolic links array to avoid infinite loops
    if (!options.symlinks) options = { ...options, symlinks: [] };

    // Skip if a cyclic symbolic link has been found
    if (options.symlinks?.find((ino) => ino === lstat.ino)) {
      return null;
    } else {
      options.symlinks?.push(lstat.ino);
    }
  }

  if (isFile(stats, item)) {
    const ext = extname(path).toLowerCase();

    // Skip if it does not match the extension regex
    if (options.extensions && !options.extensions.test(ext)) return null;

    if (options.attributes != null) {
      options.attributes.forEach((attribute) => {
        switch (attribute) {
          case "extension":
            item.extension = ext;
            break;
          case "type":
            item.type = FileType.FILE;
            break;
          default:
            item[attribute] = stats[attribute];
            break;
        }
      });
    }

    // if (onEachFile) {
    //   onEachFile(item, path, stats);
    // }
  } else if (isDirectory(stats, item)) {
    let dirData = await safeReadDir(path);

    if (dirData === null) {
      return null;
    }

    if (options.depth === undefined || options.depth > currentDepth) {
      item.children = await Promise.all(
        dirData.map((child) =>
          directoryTree(
            join(path, child),
            options,
            // onEachFile,
            // onEachDirectory,
            currentDepth + 1
          )
        )
      ).then((results) =>
        results.filter((entry): entry is DirectoryEntry => entry != null)
      );
    }

    if (options.attributes != null) {
      options.attributes.forEach((attribute) => {
        switch (attribute) {
          case "size":
            item.size = item.children.reduce((prev, cur) => prev + cur.size, 0);
            break;
          case "type":
            item.type = FileType.DIRECTORY;
            break;
          case "extension":
            break;
          default:
            item[attribute] = stats[attribute];
            break;
        }
      });
    }

    // if (onEachDirectory) {
    //   onEachDirectory(item, path, stats);
    // }
  } else {
    return null; // Or set item.size = 0 for devices, FIFO and sockets ?
  }

  return item;
}
