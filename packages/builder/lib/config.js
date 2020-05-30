"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompilerKind = void 0;
var json5_1 = __importDefault(require("json5"));
var CompilerKind;
(function (CompilerKind) {
    CompilerKind["TypeScript"] = "typescript";
    CompilerKind["Babel"] = "babel";
})(CompilerKind = exports.CompilerKind || (exports.CompilerKind = {}));
var FILENAME = 'esmconfig.json';
var DEFAULT = {
    version: '0.1',
    compiler: CompilerKind.TypeScript,
    source: 'module.ts',
    include: ['*'],
    exclude: [],
    out: { source: '@module.ts', module: 'module.js' },
    typescript: {
        compilerOptions: {
            locale: process.env.LANG.substring(0, 2),
        }
    },
    babel: {},
};
function parse(image) {
    var data = json5_1.default.parse(image);
    var choiseValue = function (defaultValue, specifiedValue, checker) {
        var value = specifiedValue || defaultValue;
        return checker ? checker(value) : value;
    };
    var choiseObject = function (defaultValue, specifiedValue) {
        return Object.assign({}, defaultValue, specifiedValue);
    };
    var version = choiseValue(DEFAULT.version, data.version);
    var compiler = choiseValue(DEFAULT.compiler, data.compiler, function (value) {
        var lowerValue = value.toLowerCase();
        if (value == 'typescript')
            return CompilerKind.TypeScript;
        if (value == 'babel')
            return CompilerKind.Babel;
        return CompilerKind.TypeScript;
    });
    var source = choiseValue(DEFAULT.source, data.source);
    var include = choiseValue(DEFAULT.include, typeof data.include === 'string' ? [data.include] : data.include);
    var exclude = choiseValue(DEFAULT.exclude, typeof data.exclude === 'string' ? [data.exclude] : data.exclude);
    var out = choiseValue(DEFAULT.out, data.out, function (value) {
        if (typeof value === 'string') {
            return { module: value };
        }
        else if (typeof value === 'object') {
            // TODO: check
            return value;
        }
        else if (typeof value === 'undefined') {
            // TODO Error handling
            console.log('Parameter "out" must need.');
            return { module: '' };
        }
        else {
            // TODO Error handling
            console.log('Parameter "out" must need.');
            return { module: '' };
        }
    });
    var typescript = choiseObject(DEFAULT.typescript, data.typescript);
    var babel = choiseObject(DEFAULT.babel, data.babel);
    return {
        version: version,
        compiler: compiler,
        source: source,
        include: include,
        exclude: exclude,
        out: out,
        typescript: typescript,
        babel: babel,
    };
}
exports.default = {
    FILENAME: FILENAME,
    parse: parse,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxnREFBeUI7QUFlekIsSUFBWSxZQUdYO0FBSEQsV0FBWSxZQUFZO0lBQ3ZCLHlDQUF5QixDQUFBO0lBQ3pCLCtCQUFlLENBQUE7QUFDaEIsQ0FBQyxFQUhXLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBR3ZCO0FBYUQsSUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUE7QUFFakMsSUFBTSxPQUFPLEdBQUc7SUFDZixPQUFPLEVBQUUsS0FBSztJQUNkLFFBQVEsRUFBRSxZQUFZLENBQUMsVUFBVTtJQUNqQyxNQUFNLEVBQUUsV0FBVztJQUNuQixPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDZCxPQUFPLEVBQUUsRUFBRTtJQUNYLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRTtJQUNsRCxVQUFVLEVBQUU7UUFDWCxlQUFlLEVBQUU7WUFDaEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3pDO0tBQ0Q7SUFDRCxLQUFLLEVBQUUsRUFBRTtDQUNDLENBQUE7QUFFWCxTQUFTLEtBQUssQ0FBQyxLQUFhO0lBQzNCLElBQU0sSUFBSSxHQUFHLGVBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFL0IsSUFBTSxXQUFXLEdBQUcsVUFBSSxZQUFlLEVBQUUsY0FBbUIsRUFBRSxPQUEyQjtRQUN4RixJQUFNLEtBQUssR0FBRyxjQUFjLElBQUksWUFBWSxDQUFBO1FBQzVDLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQTtJQUN4QyxDQUFDLENBQUE7SUFFRCxJQUFNLFlBQVks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