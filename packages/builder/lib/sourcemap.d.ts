export declare class SourceMap {
    addSource(path: string, lineStartNo: number, content: string): void;
    getLocation(wholeLineNo: number): {
        path: string;
        line: number;
    };
    private _sources;
}
export default SourceMap;
