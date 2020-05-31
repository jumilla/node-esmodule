export declare enum CompilerKind {
    TypeScript = "typescript",
    Babel = "babel"
}
export declare enum SourceMapKind {
    None = "none",
    File = "file",
    Inline = "inline"
}
export declare type Config = {
    version: string;
    compiler: CompilerKind;
    source: string;
    include: string[];
    exclude: string[];
    out: {
        source?: string;
        module: string;
        sourceMap: SourceMapKind;
    };
    typescript: {
        compilerOptions: {};
    };
    babel: {};
};
export declare const FILENAME = "esmconfig.json";
declare function parse(image: string): Config;
export default parse;
