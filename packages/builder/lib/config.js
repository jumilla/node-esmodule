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
    const typescript = choiseObject(DEFAULT.typescript, data.typescript);
    const babel = choiseObject(DEFAULT.babel, data.babel);
    return {
        version,
        compiler,
        source,
        module,
        typescript,
        babel,
    };
}
exports.default = parse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxrREFBeUI7QUFDekIsMERBQTBCO0FBSTFCLElBQVksWUFHWDtBQUhELFdBQVksWUFBWTtJQUN2Qix5Q0FBeUIsQ0FBQTtJQUN6QiwrQkFBZSxDQUFBO0FBQ2hCLENBQUMsRUFIVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUd2QjtBQUVELElBQVksYUFJWDtBQUpELFdBQVksYUFBYTtJQUN4Qiw4QkFBYSxDQUFBO0lBQ2IsOEJBQWEsQ0FBQTtJQUNiLGtDQUFpQixDQUFBO0FBQ2xCLENBQUMsRUFKVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQUl4QjtBQW9CWSxRQUFBLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQTtBQUV4QyxNQUFNLE9BQU8sR0FBRztJQUNmLE9BQU8sRUFBRSxLQUFLO0lBQ2QsUUFBUSxFQUFFLFlBQVksQ0FBQyxVQUFVO0lBQ2pDLE1BQU0sRUFBRTtRQUNQLFNBQVMsRUFBRSxHQUFHO1FBQ2QsS0FBSyxFQUFFLFdBQVc7UUFDbEIsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDO1FBQ3BCLE9BQU8sRUFBRSxFQUFFO0tBQ1g7SUFDRCxNQUFNLEVBQUU7UUFDUCxTQUFTLEVBQUUsR0FBRztRQUNkLElBQUksRUFBRSxRQUFRO1FBQ2QsU0FBUyxFQUFFLGFBQWEsQ0FBQyxJQUFJO0tBQzdCO0lBQ0QsVUFBVSxFQUFFO1FBQ1gsZUFBZSxFQUFFO1lBQ2hCLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN6QztLQUNEO0lBQ0QsS0FBSyxFQUFFLEVBQUU7Q0FDQyxDQUFBO0FBRVgsU0FBUyxLQUFLLENBQ2IsS0FBYTtJQUViLE1BQU0sSUFBSSxHQUFvQixlQUFLLENBQUMsS0FBSyxDQUFDLEtB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