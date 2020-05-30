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
        source?: string;
        module: string;
    };
    typescript: {
        compilerOptions: {};
    };
    babel: {};
};
declare function parse(image: string): Config;
declare const _default: {
    FILENAME: string;
    parse: typeof parse;
};
export default _default;
