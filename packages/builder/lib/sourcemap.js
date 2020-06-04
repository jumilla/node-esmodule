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
    addSource(path, content, lineStart = 0, lineCount = calcLineCount(content)) {
        const source = {
            path,
            content,
            lineStart,
            lineCount,
        };
        this._sources.push(source);
    }
    sources() {
        return this._sources;
    }
    wholeContent() {
        return this._sources.map(_ => _.content).join('');
    }
    getLocation(wholeLine) {
        let remain = wholeLine - 1;
        for (const source of this._sources) {
            if (remain >= source.lineCount) {
                remain -= source.lineCount;
                continue;
            }
            return {
                path: source.path,
                line: source.lineStart + remain,
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
                let { path, line } = this.getLocation(record.originalLine);
                const column = record.originalColumn;
                console.log(record.originalLine, path, line, column);
                if (line == 0) {
                    for (const s of this._sources) {
                        console.log(s.path, s.lineStart, s.lineCount);
                    }
                }
                generator.addMapping({
                    generated: { line: record.generatedLine, column: record.generatedColumn },
                    original: { line: line, column: column },
                    source: path,
                });
            });
            return generator.toJSON();
        });
    }
    toString() {
        return this._sources.map(_ => `${_.path}:${_.lineStart}:${_.lineCount}`).join('\n');
    }
}
exports.SourceMap = SourceMap;
function calcLineCount(content) {
    let count = 0;
    count = content.split(/\r\n|\n/).length;
    return count;
}
exports.default = SourceMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlbWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NvdXJjZW1hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSwyQ0FBeUY7QUFXekYsTUFBYSxTQUFTO0lBQXRCO1FBb0ZTLGFBQVEsR0FBYSxFQUFFLENBQUE7SUFDaEMsQ0FBQztJQXBGQSxTQUFTLENBQ1IsSUFBWSxFQUNaLE9BQWUsRUFDZixZQUFvQixDQUFDLEVBQ3JCLFlBQW9CLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFFMUMsTUFBTSxNQUFNLEdBQUc7WUFDZCxJQUFJO1lBQ0osT0FBTztZQUNQLFNBQVM7WUFDVCxTQUFTO1NBQ1QsQ0FBQTtRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQzNCLENBQUM7SUFFRCxPQUFPO1FBRU4sT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0lBQ3JCLENBQUM7SUFFRCxZQUFZO1FBRVgsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDbEQsQ0FBQztJQUVELFdBQVcsQ0FDVixTQUFpQjtRQUVqQixJQUFJLE1BQU0sR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFBO1FBRTFCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNuQyxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUMvQixNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQTtnQkFDMUIsU0FBUTthQUNSO1lBRUQsT0FBTztnQkFDTixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7Z0JBQ2pCLElBQUksRUFBRSxNQUFNLENBQUMsU0FBUyxHQUFHLE1BQU07YUFDL0IsQ0FBQTtTQUNEO1FBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0lBQ2xELENBQUM7SUFFSyxpQkFBaUIsQ0FDdEIsY0FBdUM7O1lBRXZDLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSw4QkFBaUIsQ0FBQyxjQUE4QixDQUFDLENBQUE7WUFFNUUsTUFBTSxTQUFTLEdBQUcsSUFBSSwrQkFBa0IsQ0FBQztnQkFDeEMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO2dCQUNuQixVQUFVLEVBQUUsRUFBRTthQUNkLENBQUMsQ0FBQTtZQUVGLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQzdCLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUE7Z0JBQzFELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUE7Z0JBRXBDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO2dCQUVwRCxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUU7b0JBQ2QsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO3dCQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUE7cUJBQzdDO2lCQUNEO2dCQUVELFNBQVMsQ0FBQyxVQUFVLENBQUM7b0JBQ3BCLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsZUFBZSxFQUFFO29CQUN6RSxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7b0JBQ3hDLE1BQU0sRUFBRSxJQUFJO2lCQUNaLENBQUMsQ0FBQTtZQUNILENBQUMsQ0FBQyxDQUFBO1lBRUYsT0FBTyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUE7UUFDMUIsQ0FBQztLQUFBO0lBRUQsUUFBUTtRQUVQLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDcEYsQ0FBQztDQUdEO0FBckZELDhCQXFGQztBQUVELFNBQVMsYUFBYSxDQUNyQixPQUFlO0lBRWYsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFBO0lBRWIsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFBO0lBRXZDLE9BQU8sS0FBSyxDQUFBO0FBQ2IsQ0FBQztBQUVELGtCQUFlLFNBQVMsQ0FBQSJ9