"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceMap = void 0;
const source_map_1 = require("source-map");
class SourceMap {
    constructor() {
        this._sources = [];
    }
    addSource(path, lines, lineStartNo = 1) {
        const source = {
            path,
            lines,
            lineStartNo,
            lineCount: lines.length,
        };
        this._sources.push(source);
    }
    sources() {
        return this._sources;
    }
    wholeContent() {
        return this._sources.map(_ => _.lines.join('\n') + '\n').join('');
    }
    getLocation(wholeLineNo) {
        let remain = wholeLineNo - 1;
        for (const source of this._sources) {
            if (remain >= source.lineCount) {
                remain -= source.lineCount;
                continue;
            }
            return {
                path: source.path,
                line: source.lineStartNo + remain,
            };
        }
        throw new Error('"wholeLineNo" is out of range.');
    }
    originalSourceMap(wholeSourceMap) {
        return __awaiter(this, void 0, void 0, function* () {
            const consumer = yield new source_map_1.SourceMapConsumer(wholeSourceMap);
            const generator = new source_map_1.SourceMapGenerator({
                file: consumer.file,
                sourceRoot: '',
            });
            consumer.eachMapping(record => {
                if (record.source) {
                    let { path, line } = this.getLocation(record.originalLine);
                    const column = record.originalColumn;
                    // console.log(11, record.originalLine, path, line, column)
                    generator.addMapping({
                        generated: { line: record.generatedLine, column: record.generatedColumn },
                        original: { line: line, column: column },
                        source: path,
                        name: record.name,
                    });
                }
                else {
                    generator.addMapping({
                        generated: { line: record.generatedLine, column: record.generatedColumn },
                    });
                }
            });
            return generator.toJSON();
        });
    }
    createFileComment(sourceMap) {
        return `//# sourceMappingURL=${sourceMap.file}.map`;
    }
    createInlineComment(sourceMap) {
        const image = Buffer.from(JSON.stringify(sourceMap), 'ascii').toString('base64');
        return `//# sourceMappingURL=data:application/json;base64,${image}`;
    }
    toString() {
        return this._sources.map(_ => `${_.path}:${_.lineStartNo}:${_.lineCount}`).join('\n');
    }
}
exports.SourceMap = SourceMap;
exports.default = SourceMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlbWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NvdXJjZW1hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSwyQ0FBeUY7QUFXekYsTUFBYSxTQUFTO0lBQXRCO1FBK0ZTLGFBQVEsR0FBYSxFQUFFLENBQUE7SUFDaEMsQ0FBQztJQS9GQSxTQUFTLENBQ1IsSUFBWSxFQUNaLEtBQWUsRUFDZixjQUFzQixDQUFDO1FBRXZCLE1BQU0sTUFBTSxHQUFHO1lBQ2QsSUFBSTtZQUNKLEtBQUs7WUFDTCxXQUFXO1lBQ1gsU0FBUyxFQUFFLEtBQUssQ0FBQyxNQUFNO1NBQ3ZCLENBQUE7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUMzQixDQUFDO0lBRUQsT0FBTztRQUVOLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQTtJQUNyQixDQUFDO0lBRUQsWUFBWTtRQUVYLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDbEUsQ0FBQztJQUVELFdBQVcsQ0FDVixXQUFtQjtRQUVuQixJQUFJLE1BQU0sR0FBRyxXQUFXLEdBQUcsQ0FBQyxDQUFBO1FBRTVCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNuQyxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUMvQixNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQTtnQkFDMUIsU0FBUTthQUNSO1lBRUQsT0FBTztnQkFDTixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7Z0JBQ2pCLElBQUksRUFBRSxNQUFNLENBQUMsV0FBVyxHQUFHLE1BQU07YUFDakMsQ0FBQTtTQUNEO1FBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0lBQ2xELENBQUM7SUFFSyxpQkFBaUIsQ0FDdEIsY0FBNEI7O1lBRTVCLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSw4QkFBaUIsQ0FBQyxjQUFjLENBQUMsQ0FBQTtZQUU1RCxNQUFNLFNBQVMsR0FBRyxJQUFJLCtCQUFrQixDQUFDO2dCQUN4QyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7Z0JBQ25CLFVBQVUsRUFBRSxFQUFFO2FBQ2QsQ0FBQyxDQUFBO1lBRUYsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDN0IsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO29CQUNsQixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFBO29CQUMxRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFBO29CQUVwQywyREFBMkQ7b0JBRTNELFNBQVMsQ0FBQyxVQUFVLENBQUM7d0JBQ3BCLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsZUFBZSxFQUFFO3dCQUN6RSxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7d0JBQ3hDLE1BQU0sRUFBRSxJQUFJO3dCQUNaLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtxQkFDakIsQ0FBQyxDQUFBO2lCQUNGO3FCQUNJO29CQUNKLFNBQVMsQ0FBQyxVQUFVLENBQUM7d0JBQ3BCLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsZUFBZSxFQUFFO3FCQUM5RCxDQUFDLENBQUE7aUJBQ2I7WUFDRixDQUFDLENBQUMsQ0FBQTtZQUVGLE9BQU8sU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBQzFCLENBQUM7S0FBQTtJQUVELGlCQUFpQixDQUFDLFNBQXVCO1FBQ3hDLE9BQU8sd0JBQXdCLFNBQVMsQ0FBQyxJQUFJLE1BQU0sQ0FBQTtJQUNwRCxDQUFDO0lBRUQsbUJBQW1CLENBQUMsU0FBdUI7UUFDMUMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUVoRixPQUFPLHFEQUFxRCxLQUFLLEVBQUUsQ0FBQTtJQUNwRSxDQUFDO0lBRUQsUUFBUTtRQUVQLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdEYsQ0FBQztDQUdEO0FBaEdELDhCQWdHQztBQUVELGtCQUFlLFNBQVMsQ0FBQSJ9