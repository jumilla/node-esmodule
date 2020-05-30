declare const _default: {
    extractDirectoryPath: typeof extractDirectoryPath;
    joinPath: typeof joinPath;
    resolvePath: typeof resolvePath;
    normalizePath: typeof normalizePath;
    testFileExists: typeof testFileExists;
    readFile: typeof readFile;
    writeFile: typeof writeFile;
    touchDirectories: typeof touchDirectories;
};
export default _default;
declare function extractDirectoryPath(path: string): string;
declare function joinPath(path1: string, path2: string): string;
declare function resolvePath(baseDirectoryPath: string, filename: string): string;
declare function normalizePath(path: string): string;
declare function testFileExists(path: string): boolean;
declare function readFile(path: string): string;
declare function writeFile(path: string, content: string): void;
declare function touchDirectories(filepath: string): string;