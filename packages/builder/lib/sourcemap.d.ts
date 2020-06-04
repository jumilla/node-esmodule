export interface Source {
    content: string;
    path: string;
    lineStart: number;
    lineCount: number;
}
export declare class SourceMap {
    addSource(path: string, content: string, lineStart?: number, lineCount?: number): void;
    sources(): Source[];
    wholeContent(): string;
    getLocation(wholeLine: number): {
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
