
import { SourceMapConsumer, SourceMapGenerator, RawSourceMap } from 'source-map'



export interface Source {
	path: string
	lines: string[]
	lineStartNo: number
	lineCount: number
}

export class SourceMap {
	addSource(
		path: string,
		lines: string[],
		lineStartNo: number = 1,
	): void {
		const source = {
			path,
			lines,
			lineStartNo,
			lineCount: lines.length,
		}

		this._sources.push(source)
	}

	sources(
	): Source[] {
		return this._sources
	}

	wholeContent(
	): string {
		return this._sources.map(_ => _.lines.join('\n') + '\n').join('')
	}

	getLocation(
		wholeLineNo: number,
	): { path: string, line: number } {
		let remain = wholeLineNo - 1

		for (const source of this._sources) {
			if (remain >= source.lineCount) {
				remain -= source.lineCount
				continue
			}

			return {
				path: source.path,
				line: source.lineStartNo + remain,
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

			// console.log(record.originalLine, path, line, column)

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
		return this._sources.map(_ => `${_.path}:${_.lineStartNo}:${_.lineCount}`).join('\n')
	}

	private _sources: Source[] = []
}

export default SourceMap
