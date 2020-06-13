"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const platform_1 = __importDefault(require("../platform"));
const meta_1 = __importDefault(require("../meta"));
const npmlog_1 = __importDefault(require("npmlog"));
let babel;
function build(project) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!babel) {
                babel = yield Promise.resolve().then(() => __importStar(require('@babel/core')));
            }
        }
        catch (error) {
            throw new Error('Need installing "@babel/core".');
        }
        const preset = yield Promise.resolve().then(() => __importStar(require('@babel/preset-env')));
        const sourcePath = project.modulePathWithoutExtension + '.js';
        const sourceText = project.sourceMap.wholeContent();
        const options = Object.assign(Object.assign({
            presets: [
                [
                    require('@babel/preset-env'),
                ],
            ],
            plugins: [],
        }, {
            // include: project.sourceMap.sources().map(_ => _.path),
            sourceMap: project.config.module.sourceMap != config_1.SourceMapKind.None,
        }), project.config.babel);
        const result = babel.transformSync(sourceText, options);
        if (!result) {
            throw new Error('transform failed.');
        }
        if (result.code) {
            if (project.config.module.sourceMap == config_1.SourceMapKind.None) {
                writeFile(project, '.mjs', result.code);
            }
            else {
                const moduleMap = yield project.sourceMap.originalSourceMap(result.map);
                moduleMap.file = platform_1.default.extractFileTitlePath(project.modulePathWithoutExtension) + '.js';
                switch (project.config.module.sourceMap) {
                    case config_1.SourceMapKind.File:
                        result.code += '\n' + project.sourceMap.createFileComment(moduleMap);
                        break;
                    case config_1.SourceMapKind.Inline:
                        result.code += '\n' + project.sourceMap.createInlineComment(moduleMap);
                        break;
                }
                writeFile(project, '.mjs', result.code);
                if (project.config.module.sourceMap == config_1.SourceMapKind.File) {
                    writeFile(project, '.mjs.map', JSON.stringify(moduleMap));
                }
            }
        }
        // console.log(result)
    });
}
function writeFile(project, extension, text) {
    const path = platform_1.default.resolvePath(project.modulePathWithoutExtension + extension);
    platform_1.default.writeFile(path, text);
    npmlog_1.default.info(meta_1.default.program, `'${path}' generated.`);
}
exports.default = {
    build,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFiZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcGlsZXJzL2JhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHNDQUFpRDtBQUVqRCwyREFBMkI7QUFDM0IsbURBQTBCO0FBQzFCLG9EQUF3QjtBQUt4QixJQUFJLEtBQW1CLENBQUE7QUFJdkIsU0FBZSxLQUFLLENBQUMsT0FBZ0I7O1FBQ3BDLElBQUk7WUFDSCxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNYLEtBQUssR0FBRyx3REFBYSxhQUFhLEdBQUMsQ0FBQTthQUNuQztTQUNEO1FBQ0QsT0FBTyxLQUFLLEVBQUU7WUFDYixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7U0FDakQ7UUFFRCxNQUFNLE1BQU0sR0FBRyx3REFBYSxtQkFBbUIsR0FBQyxDQUFBO1FBRWhELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsR0FBRyxLQUFLLENBQUE7UUFFN0QsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUVuRCxNQUFNLE9BQU8sK0JBRVQ7WUFDRixPQUFPLEVBQUU7Z0JBQ1I7b0JBQ0MsT0FBTyxDQUFDLG1CQUFtQixDQUFDO2lCQUU1QjthQUNEO1lBQ0QsT0FBTyxFQUFFLEVBQUU7U0FDWCxFQUdFO1lBQ0YseURBQXlEO1lBQ3pELFNBQVMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksc0JBQWEsQ0FBQyxJQUFJO1NBQ2hFLEdBR0UsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQ3ZCLENBQUE7UUFFRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUV2RCxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1NBQ3BDO1FBRUQsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQ2hCLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLHNCQUFhLENBQUMsSUFBSSxFQUFFO2dCQUMxRCxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7YUFDdkM7aUJBQ0k7Z0JBQ0osTUFBTSxTQUFTLEdBQUcsTUFBTSxPQUFPLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxHQUFJLENBQUMsQ0FBQTtnQkFFeEUsU0FBUyxDQUFDLElBQUksR0FBRyxrQkFBQyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxHQUFHLEtBQUssQ0FBQTtnQkFFbkYsUUFBUSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7b0JBQ3hDLEtBQUssc0JBQWEsQ0FBQyxJQUFJO3dCQUN0QixNQUFNLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFBO3dCQUNwRSxNQUFLO29CQUNOLEtBQUssc0JBQWEsQ0FBQyxNQUFNO3dCQUN4QixNQUFNLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFBO3dCQUN0RSxNQUFLO2lCQUNOO2dCQUVELFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDdkMsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksc0JBQWEsQ0FBQyxJQUFJLEVBQUU7b0JBQzFELFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtpQkFDekQ7YUFDRDtTQUNEO1FBRUQsc0JBQXNCO0lBQ3ZCLENBQUM7Q0FBQTtBQUVELFNBQVMsU0FBUyxDQUNqQixPQUFnQixFQUNoQixTQUFpQixFQUNqQixJQUFZO0lBRVosTUFBTSxJQUFJLEdBQUcsa0JBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLDBCQUEwQixHQUFHLFNBQVMsQ0FBQyxDQUFBO0lBRTFFLGtCQUFDLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUV2QixnQkFBRyxDQUFDLElBQUksQ0FBQyxjQUFJLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSSxjQUFjLENBQUMsQ0FBQTtBQUMvQyxDQUFDO0FBSUQsa0JBQWU7SUFDZCxLQUFLO0NBQ0wsQ0FBQSJ9