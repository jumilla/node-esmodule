"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILENAME = exports.SourceMapKind = exports.CompilerKind = void 0;
const json5_1 = __importDefault(require("json5"));
const platform_1 = __importDefault(require("./platform"));
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
    source: {
        directory: '.',
        entry: 'module.ts',
        include: ['**/*.ts'],
        exclude: [],
    },
    module: {
        directory: '.',
        name: 'module',
        sourceMap: SourceMapKind.None,
    },
    debug: {},
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
    const source = choiseValue(DEFAULT.source, data.source, value => {
        if (typeof value === 'string') {
            return {
                directory: '.',
                entry: value,
                include: ['**/*'],
                exclude: [],
            };
        }
        // TODO: check value.entry
        const include = choiseValue(DEFAULT.source.include, typeof value.include === 'string' ? [value.include] : value.include);
        const exclude = choiseValue(DEFAULT.source.exclude, typeof value.exclude === 'string' ? [value.exclude] : value.exclude);
        return {
            directory: value.directory || DEFAULT.source.directory,
            entry: value.entry,
            include,
            exclude,
        };
    });
    const module = choiseValue(DEFAULT.module, data.module, value => {
        if (typeof value === 'string') {
            return {
                directory: platform_1.default.extractDirectoryPath(value),
                name: platform_1.default.extractFileTitlePath(value),
                sourceMap: SourceMapKind.None,
            };
        }
        else if (typeof value === 'object') {
            // TODO: check value.name
            const sourceMap = choiseValue(DEFAULT.module.sourceMap, value.sourceMap, (value) => {
                const lowerValue = value.toLowerCase();
                if (value == 'file')
                    return SourceMapKind.File;
                if (value == 'inline')
                    return SourceMapKind.Inline;
                return SourceMapKind.None;
            });
            return {
                directory: value.directory || DEFAULT.module.directory,
                name: value.name,
                sourceMap: sourceMap,
            };
        }
        else if (typeof value === 'undefined') {
            // TODO Error handling
            console.log('Parameter "module" must need.');
            return { directory: '', name: '', sourceMap: SourceMapKind.None };
        }
        else {
            // TODO Error handling
            console.log('Parameter "module" must need.');
            return { directory: '', name: '', sourceMap: SourceMapKind.None };
        }
    });
    const debug = choiseObject(DEFAULT.debug, data.debug);
    const typescript = choiseObject(DEFAULT.typescript, data.typescript);
    const babel = choiseObject(DEFAULT.babel, data.babel);
    return {
        version,
        compiler,
        source,
        module,
        debug,
        typescript,
        babel,
    };
}
exports.default = parse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxrREFBeUI7QUFDekIsMERBQTBCO0FBSTFCLElBQVksWUFHWDtBQUhELFdBQVksWUFBWTtJQUN2Qix5Q0FBeUIsQ0FBQTtJQUN6QiwrQkFBZSxDQUFBO0FBQ2hCLENBQUMsRUFIVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUd2QjtBQUVELElBQVksYUFJWDtBQUpELFdBQVksYUFBYTtJQUN4Qiw4QkFBYSxDQUFBO0lBQ2IsOEJBQWEsQ0FBQTtJQUNiLGtDQUFpQixDQUFBO0FBQ2xCLENBQUMsRUFKVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQUl4QjtBQXVCWSxRQUFBLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQTtBQUV4QyxNQUFNLE9BQU8sR0FBRztJQUNmLE9BQU8sRUFBRSxLQUFLO0lBQ2QsUUFBUSxFQUFFLFlBQVksQ0FBQyxVQUFVO0lBQ2pDLE1BQU0sRUFBRTtRQUNQLFNBQVMsRUFBRSxHQUFHO1FBQ2QsS0FBSyxFQUFFLFdBQVc7UUFDbEIsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDO1FBQ3BCLE9BQU8sRUFBRSxFQUFFO0tBQ1g7SUFDRCxNQUFNLEVBQUU7UUFDUCxTQUFTLEVBQUUsR0FBRztRQUNkLElBQUksRUFBRSxRQUFRO1FBQ2QsU0FBUyxFQUFFLGFBQWEsQ0FBQyxJQUFJO0tBQzdCO0lBQ0QsS0FBSyxFQUFFLEVBQ047SUFDRCxVQUFVLEVBQUU7UUFDWCxlQUFlLEVBQUU7WUFDaEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3pDO0tBQ0Q7SUFDRCxLQUFLLEVBQUUsRUFBRTtDQUNDLENBQUE7QUFFWCxTQUFTLEtBQUssQ0FDYixLQUFhO0lBRWIsTUFBTSxJQUFJLEdBQW9CLGVB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