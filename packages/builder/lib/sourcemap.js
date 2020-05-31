"use strict";
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
    getLocation(wholeLine) {
        let remain = wholeLine;
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
        throw new Error('wholeLineNo is out of range.');
    }
    async originalSourceMap(wholeSourceMap) {
        const consumer = await new source_map_1.SourceMapConsumer(wholeSourceMap);
        const generator = new source_map_1.SourceMapGenerator({
            file: consumer.file,
            sourceRoot: '',
        });
        consumer.eachMapping(record => {
            const { path, line } = this.getLocation(record.originalLine);
            const column = record.originalColumn;
            // console.log(path, line, column)
            generator.addMapping({
                generated: { line: record.generatedLine, column: record.generatedColumn },
                original: { line: line, column: column },
                source: path,
            });
        });
        return generator.toJSON();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlbWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NvdXJjZW1hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwyQ0FBeUY7QUFXekYsTUFBYSxTQUFTO0lBQXRCO1FBeUVTLGFBQVEsR0FBYSxFQUFFLENBQUE7SUFDaEMsQ0FBQztJQXpFQSxTQUFTLENBQ1IsSUFBWSxFQUNaLE9BQWUsRUFDZixZQUFvQixDQUFDLEVBQ3JCLFlBQW9CLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFFMUMsTUFBTSxNQUFNLEdBQUc7WUFDZCxJQUFJO1lBQ0osT0FBTztZQUNQLFNBQVM7WUFDVCxTQUFTO1NBQ1QsQ0FBQTtRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQzNCLENBQUM7SUFFRCxPQUFPO1FBRU4sT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0lBQ3JCLENBQUM7SUFFRCxXQUFXLENBQ1YsU0FBaUI7UUFFakIsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFBO1FBRXRCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNuQyxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUMvQixNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQTtnQkFDMUIsU0FBUTthQUNSO1lBRUQsT0FBTztnQkFDTixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7Z0JBQ2pCLElBQUksRUFBRSxNQUFNLENBQUMsU0FBUyxHQUFHLE1BQU07YUFDL0IsQ0FBQTtTQUNEO1FBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0lBQ2hELENBQUM7SUFFRCxLQUFLLENBQUMsaUJBQWlCLENBQ3RCLGNBQXVDO1FBRXZDLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSw4QkFBaUIsQ0FBQyxjQUE4QixDQUFDLENBQUE7UUFFNUUsTUFBTSxTQUFTLEdBQUcsSUFBSSwrQkFBa0IsQ0FBQztZQUN4QyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7WUFDbkIsVUFBVSxFQUFFLEVBQUU7U0FDZCxDQUFDLENBQUE7UUFFRixRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzdCLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUE7WUFDNUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQTtZQUVwQyxrQ0FBa0M7WUFFbEMsU0FBUyxDQUFDLFVBQVUsQ0FBQztnQkFDcEIsU0FBUyxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxlQUFlLEVBQUU7Z0JBQ3pFLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtnQkFDeEMsTUFBTSxFQUFFLElBQUk7YUFDWixDQUFDLENBQUE7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUVGLE9BQU8sU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFBO0lBQzFCLENBQUM7SUFFRCxRQUFRO1FBRVAsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNwRixDQUFDO0NBR0Q7QUExRUQsOEJBMEVDO0FBRUQsU0FBUyxhQUFhLENBQ3JCLE9BQWU7SUFFZixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUE7SUFFYixLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUE7SUFFdkMsT0FBTyxLQUFLLENBQUE7QUFDYixDQUFDO0FBRUQsa0JBQWUsU0FBUyxDQUFBIn0=