
export interface Source {
	content: string
	path: string
	lineStart: number
	lineCount: number
}

export class SourceMap {
	addSource(path: string, content: string, lineStart: number = 0, lineCount: number = calcLineCount(content)): void {
		const source = {
			path,
			content,
			lineStart,
			lineCount,
		}

		this._sources.push(source)
	}

	sources(): Source[] {
		return this._sources
	}

	getLocation(wholeLine: number): { path: string, line: number } {
		let remain = wholeLine

		for (const source of this._sources) {
			// console.log(`${source.path}:${source.lineStart}:${source.lineCount}`, remain)
			if (remain >= source.lineCount) {
				remain -= source.lineCount
				continue
			}

			return {
				path: source.path,
				line: source.lineStart + remain,
			}
		}

		throw new Error('wholeLineNo is out of range.')
	}

	toString(): string {
		return this._sources.map(_ => `${_.path}:${_.lineStart}:${_.lineCount}`).join('\n')
	}

	private _sources: Source[] = []
}

function calcLineCount(content: string): number {
	let count = 0

	count = content.split(/\r\n|\n/).length

	return count
}

export default SourceMap
