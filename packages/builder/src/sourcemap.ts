
import { SourceMapConsumer, Mapping, SourceMapGenerator, RawSourceMap } from 'source-map'



export interface Source {
	content: string
	path: string
	lineStart: number
	lineCount: number
}

export class SourceMap {
	addSource(
		path: string,
		content: string,
		lineStart: number = 0,
		lineCount: number = calcLineCount(content),
	): void {
		const source = {
			path,
			content,
			lineStart,
			lineCount,
		}

		this._sources.push(source)
	}

	sources(
	): Source[] {
		return this._sources
	}

	wholeContent(
	): string {
		return this._sources.map(_ => _.content).join('')
	}

	getLocation(
		wholeLine: number,
	): { path: string, line: number } {
		let remain = wholeLine - 1

		for (const source of this._sources) {
			if (remain >= source.lineCount) {
				remain -= source.lineCount
				continue
			}

			return {
				path: source.path,
				line: source.lineStart + remain,
			}
		}

		throw new Error('"wholeLineNo" is out of range.')
	}

	async originalSourceMap(
		wholeSourceMap: { [name: string]: any },
	): Promise<{ [name: string]: any }> {
		const consumer = await new SourceMapConsumer(wholeSourceMap as RawSourceMap)

		const generator = new SourceMapGenerator({
			file: consumer.file,
			sourceRoot: '',
		})

		consumer.eachMapping(record => {
			let { path, line } = this.getLocation(record.originalLine)
			const column = record.originalColumn

			console.log(record.originalLine, path, line, column)

			if (line == 0) {
				for (const s of this._sources) {
					console.log(s.path, s.lineStart, s.lineCount)
				}
			}

			generator.addMapping({
				generated: { line: record.generatedLine, column: record.generatedColumn },
				original: { line: line, column: column },
				source: path,
			})
		})

		return generator.toJSON()
	}

	toString(
	): string {
		return this._sources.map(_ => `${_.path}:${_.lineStart}:${_.lineCount}`).join('\n')
	}

	private _sources: Source[] = []
}

function calcLineCount(
	content: string,
): number {
	let count = 0

	count = content.split(/\r\n|\n/).length

	return count
}

export default SourceMap
