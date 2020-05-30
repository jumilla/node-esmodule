"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SourceMap = /** @class */ (function () {
    function SourceMap() {
        this._sources = [];
    }
    SourceMap.prototype.addSource = function (path, content, lineStart, lineCount) {
        if (lineStart === void 0) { lineStart = 0; }
        if (lineCount === void 0) { lineCount = calcLineCount(content); }
        var source = {
            path: path,
            content: content,
            lineStart: lineStart,
            lineCount: lineCount,
        };
        this._sources.push(source);
    };
    SourceMap.prototype.sources = function () {
        return this._sources;
    };
    SourceMap.prototype.getLocation = function (wholeLine) {
        var remain = wholeLine;
        for (var _i = 0, _a = this._sources; _i < _a.length; _i++) {
            var source = _a[_i];
            // console.log(`${source.path}:${source.lineStart}:${source.lineCount}`, remain)
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
    };
    SourceMap.prototype.toString = function () {
        return this._sources.map(function (_) { return _.path + ":" + _.lineStart + ":" + _.lineCount; }).join('\n');
    };
    return SourceMap;
}());
exports.SourceMap = SourceMap;
function calcLineCount(content) {
    var count = 0;
    count = content.split(/\r\n|\n/).length;
    return count;
}
exports.default = SourceMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlbWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NvdXJjZW1hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFBO0lBQUE7UUF1Q1MsYUFBUSxHQUFhLEVBQUUsQ0FBQTtJQUNoQyxDQUFDO0lBdkNBLDZCQUFTLEdBQVQsVUFBVSxJQUFZLEVBQUUsT0FBZSxFQUFFLFNBQXFCLEVBQUUsU0FBMEM7UUFBakUsMEJBQUEsRUFBQSxhQUFxQjtRQUFFLDBCQUFBLEVBQUEsWUFBb0IsYUFBYSxDQUFDLE9BQU8sQ0FBQztRQUN6RyxJQUFNLE1BQU0sR0FBRztZQUNkLElBQUksTUFBQTtZQUNKLE9BQU8sU0FBQTtZQUNQLFNBQVMsV0FBQTtZQUNULFNBQVMsV0FBQTtTQUNULENBQUE7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUMzQixDQUFDO0lBRUQsMkJBQU8sR0FBUDtRQUNDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQTtJQUNyQixDQUFDO0lBRUQsK0JBQVcsR0FBWCxVQUFZLFNBQWlCO1FBQzVCLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQTtRQUV0QixLQUFxQixVQUFhLEVBQWIsS0FBQSxJQUFJLENBQUMsUUFBUSxFQUFiLGNBQWEsRUFBYixJQUFhLEVBQUU7WUFBL0IsSUFBTSxNQUFNLFNBQUE7WUFDaEIsZ0ZBQWdGO1lBQ2hGLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Z0JBQy9CLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFBO2dCQUMxQixTQUFRO2FBQ1I7WUFFRCxPQUFPO2dCQUNOLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtnQkFDakIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxTQUFTLEdBQUcsTUFBTTthQUMvQixDQUFBO1NBQ0Q7UUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUE7SUFDaEQsQ0FBQztJQUVELDRCQUFRLEdBQVI7UUFDQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUcsQ0FBQyxDQUFDLElBQUksU0FBSSxDQUFDLENBQUMsU0FBUyxTQUFJLENBQUMsQ0FBQyxTQUFXLEVBQXpDLENBQXlDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDcEYsQ0FBQztJQUdGLGdCQUFDO0FBQUQsQ0FBQyxBQXhDRCxJQXdDQztBQXhDWSw4QkFBUztBQTBDdEIsU0FBUyxhQUFhLENBQUMsT0FBZTtJQUNyQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUE7SUFFYixLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUE7SUFFdkMsT0FBTyxLQUFLLENBQUE7QUFDYixDQUFDO0FBRUQsa0JBQWUsU0FBUyxDQUFBIn0=