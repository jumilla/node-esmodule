"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILENAME = exports.SourceMapKind = exports.CompilerKind = void 0;
const json5_1 = __importDefault(require("json5"));
var CompilerKind;
(function (CompilerKind) {
    CompilerKind["TypeScript"] = "typescript";
    CompilerKind["Babel"] = "babel";
})(CompilerKind = exports.CompilerKind || (exports.CompilerKind = {}));
var SourceMapKind;
(function (SourceMapKind) {
    SourceMapKind["None"] = "none";
    SourceMapKind["File"] = "file";
    SourceMapKind["Inline"] = "inline";
})(SourceMapKind = exports.SourceMapKind || (exports.SourceMapKind = {}));
exports.FILENAME = 'esmconfig.json';
const DEFAULT = {
    version: '1.0',
    compiler: CompilerKind.TypeScript,
    source: 'module.ts',
    include: ['*'],
    exclude: [],
    out: { module: 'module.js', sourceMap: SourceMapKind.None },
    typescript: {
        compilerOptions: {
            locale: process.env.LANG.substring(0, 2),
        }
    },
    babel: {},
};
function parse(image) {
    const data = json5_1.default.parse(image);
    const choiseValue = (defaultValue, specifiedValue, checker) => {
        const value = specifiedValue || defaultValue;
        return checker ? checker(value) : value;
    };
    const choiseObject = (defaultValue, specifiedValue) => {
        return Object.assign({}, defaultValue, specifiedValue);
    };
    const version = choiseValue(DEFAULT.version, data.version);
    const compiler = choiseValue(DEFAULT.compiler, data.compiler, (value) => {
        const lowerValue = value.toLowerCase();
        if (value == 'typescript')
            return CompilerKind.TypeScript;
        if (value == 'babel')
            return CompilerKind.Babel;
        return CompilerKind.TypeScript;
    });
    const source = choiseValue(DEFAULT.source, data.source);
    const include = choiseValue(DEFAULT.include, typeof data.include === 'string' ? [data.include] : data.include);
    const exclude = choiseValue(DEFAULT.exclude, typeof data.exclude === 'string' ? [data.exclude] : data.exclude);
    const out = choiseValue(DEFAULT.out, data.out, value => {
        if (typeof value === 'string') {
            return { module: value, sourceMap: SourceMapKind.None };
        }
        else if (typeof value === 'object') {
            const sourceMap = choiseValue(DEFAULT.out.sourceMap, value.sourceMap, (value) => {
                const lowerValue = value.toLowerCase();
                if (value == 'file')
                    return SourceMapKind.File;
                if (value == 'inline')
                    return SourceMapKind.Inline;
                return SourceMapKind.None;
            });
            // TODO: check
            return {
                source: value.source,
                module: value.module || '',
                sourceMap: sourceMap,
            };
        }
        else if (typeof value === 'undefined') {
            // TODO Error handling
            console.log('Parameter "out" must need.');
            return { module: '', sourceMap: SourceMapKind.None };
        }
        else {
            // TODO Error handling
            console.log('Parameter "out" must need.');
            return { module: '', sourceMap: SourceMapKind.None };
        }
    });
    const typescript = choiseObject(DEFAULT.typescript, data.typescript);
    const babel = choiseObject(DEFAULT.babel, data.babel);
    return {
        version,
        compiler,
        source,
        include,
        exclude,
        out,
        typescript,
        babel,
    };
}
exports.default = parse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxrREFBeUI7QUFJekIsSUFBWSxZQUdYO0FBSEQsV0FBWSxZQUFZO0lBQ3ZCLHlDQUF5QixDQUFBO0lBQ3pCLCtCQUFlLENBQUE7QUFDaEIsQ0FBQyxFQUhXLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBR3ZCO0FBRUQsSUFBWSxhQUlYO0FBSkQsV0FBWSxhQUFhO0lBQ3hCLDhCQUFhLENBQUE7SUFDYiw4QkFBYSxDQUFBO0lBQ2Isa0NBQWlCLENBQUE7QUFDbEIsQ0FBQyxFQUpXLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBSXhCO0FBYVksUUFBQSxRQUFRLEdBQUcsZ0JBQWdCLENBQUE7QUFFeEMsTUFBTSxPQUFPLEdBQUc7SUFDZixPQUFPLEVBQUUsS0FBSztJQUNkLFFBQVEsRUFBRSxZQUFZLENBQUMsVUFBVTtJQUNqQyxNQUFNLEVBQUUsV0FBVztJQUNuQixPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDZCxPQUFPLEVBQUUsRUFBRTtJQUNYLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLGFBQWEsQ0FBQyxJQUFJLEVBQUU7SUFDM0QsVUFBVSxFQUFFO1FBQ1gsZUFBZSxFQUFFO1lBQ2hCLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN6QztLQUNEO0lBQ0QsS0FBSyxFQUFFLEVBQUU7Q0FDQyxDQUFBO0FBRVgsU0FBUyxLQUFLLENBQ2IsS0FBYTtJQUViLE1BQU0sSUFBSSxHQUFvQixlQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRWhELE1BQU0sV0FBVyxHQUFHLENBQUksWUFBZSxFQUFFLGNBQW1CLEVBQUUsT0FBMkIsRUFBSyxFQUFF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