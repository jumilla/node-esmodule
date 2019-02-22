export declare type ConfigSource = {
    version?: string;
    compiler?: string;
    source?: string;
    include?: string | string[];
    exclude?: string | string[];
    out?: string | {
        source: string;
        module: string;
    };
    typescript?: {};
    babel?: {};
};
export declare enum CompilerKind {
    TypeScript = "typescript",
    Babel = "babel"
}
export declare type Config = {
    version: string;
    compiler: CompilerKind;
    source: string;
    include: string[];
    exclude: string[];
    out: {
        source: string;
        module: string;
    };
    typescript: {
        compilerOptions: {};
    };
    babel: {};
};
export declare type Project = {
    baseDirectoryPath: string;
    configFilePath?: string;
    config: Config;
    definitionPath: string;
    codePaths: string[];
    moduleSourcePath?: string;
    typePath: string;
    moduleEsmPath: string;
    moduleCjsPath?: string;
    sourceMapPath: string;
};
declare function resolvePath(baseDirectoryPath: string, filename: string): string;
declare function exists(filePath: string): boolean;
declare function load(configFilePath: string, baseDirectoryPath?: string): Project;
declare function expandFilePatterns(directoryPath: string, config: Config): string[];
declare const _default: {
    FILENAME: string;
    resolvePath: typeof resolvePath;
    exists: typeof exists;
    load: typeof load;
    expandFilePatterns: typeof expandFilePatterns;
};
export default _default;
