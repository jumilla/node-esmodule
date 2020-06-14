declare type Program = {
    directoryPath: string;
    logLevel?: string;
};
export declare function launch(program: Program): Promise<void>;
export {};
