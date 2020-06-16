declare type Program = {
    configFilePath: string;
    logLevel?: string;
};
export declare function processCommandLine(args: string[]): Program;
export declare function run(program: Program): Promise<void>;
export {};
