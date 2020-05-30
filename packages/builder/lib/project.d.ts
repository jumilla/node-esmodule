import { Config } from './config';
import { SourceMap } from './sourcemap';
declare const _default: {
    load: typeof load;
    build: typeof build;
};
export default _default;
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
    sourceMap: SourceMap;
};
declare function load(configFilePath: string, baseDirectoryPath?: string): Project;
declare function build(project: Project): void;
