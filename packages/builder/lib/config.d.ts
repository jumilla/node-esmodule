export declare type Config = {
    version: string;
    compiler?: string;
    include: string[];
    out: string;
    typescript?: {
        compilerOptions?: {};
    };
};
export declare type Project = {
    baseDirectoryPath: string;
    configFilePath?: string;
    config: Config;
    sourcePaths: string[];
    typePath: string;
    moduleEsmPath: string;
    sourceMapPath: string;
};
declare function resolvePath(directoryOfFilePath: string): string;
declare function exists(filePath: string): boolean;
declare function load(configFilePath: string, baseDirectoryPath?: string): Project;
declare function expandFilePatterns(directoryPath: string, patterns: string[]): string[];
declare const _default: {
    FILENAME: string;
    resolvePath: typeof resolvePath;
    exists: typeof exists;
    load: typeof load;
    expandFilePatterns: typeof expandFilePatterns;
};
export default _default;
