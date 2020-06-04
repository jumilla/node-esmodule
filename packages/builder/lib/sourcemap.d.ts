export interface Source {
    path: string;
    lines: string[];
    lineStartNo: number;
    lineCount: number;
}
export declare class SourceMap {
    addSource(path: string, lines: string[], lineStartNo?: number): void;
    sources(): Source[];
    wholeContent(): string;
    getLocation(wholeLineNo: number): {
        path: string;
        line: number;
    };
    originalSourceMap(wholeSourceMap: {
        [name: string]: any;
    }): Promise<{
        [name: string]: any;
    }>;
    toString(): string;
    private _sources;
}
export default SourceMap;
