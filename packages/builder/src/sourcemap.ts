
class Source {
	constructor(path: string, content: string) {
		this._path = path
		this._content = content
		this._lineCount = calcLineCount(content)
	}

	path(): string {
		return this._path
	}

	content(): string {
		return this._content
	}

	lineCount(): number {
		return this._lineCount
	}

	private _path: string
	private _content: string
	private _lineCount: number
}

function calcLineCount(content: string): number {
	let count = 0

	count = content.split(/\r\n|\n/).length

	return count
}

export class SourceMap {
	addSource(path: string, lineStartNo: number, content: string): void {
		this._sources.push(new Source(path, content))
	}

	getLocation(wholeLineNo: number): { path: string, line: number } {
		let remain = wholeLineNo

		for (const source of this._sources) {
			if (source.lineCount() >= remain) {
				remain -= source.lineCount()
				continue
			}

			return {
				path: source.path(),
				line: remain,
			}
		}

		throw new Error('wholeLineNo is out of range.')
	}

	private _sources: Source[] = []
}

export default SourceMap
