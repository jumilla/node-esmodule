export interface Source {
    content: string;
    path: string;
    lineStart: number;
    lineCount: number;
}
export declare class SourceMap {
    addSource(path: string, content: string, lineStart?: number, lineCount?: number): void;
    sources(): Source[];
    getLocation(wholeLine: number): {
        path: string;
        line: number;
    };
    toString(): string;
    private _sources;
}
export default SourceMap;
