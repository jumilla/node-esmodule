
import fs from 'fs'
import fspath from 'path'

export default {
	extractDirectoryPath,
	extractFileTitlePath,
	joinPath,
	resolvePath,
	normalizePath,
	testFileExists,
	readFile,
	writeFile,
	touchDirectories,
}

function extractDirectoryPath(
	path: string,
): string {
	return fspath.dirname(path)
}

function extractFileTitlePath(
	path: string,
	extension?: string,
): string {
	return fspath.basename(path, extension)
}

function joinPath(
	path1: string,
	path2: string,
): string {
	return fspath.join(path1, path2)
}

function resolvePath(
	baseDirectoryPath: string,
	filename: string,
): string {
	return fspath.normalize(fspath.join(baseDirectoryPath, filename))
}

function normalizePath(
	path: string,
): string {
	return fspath.normalize(path)
}

function testFileExists(
	path: string,
): boolean {
	try {
		fs.accessSync(path, fs.constants.R_OK)
		return true
	}
	catch (error) {
		return false
	}
}

function readFile(
	path: string,
): string {
	return fs.readFileSync(path, { encoding: 'utf8' })
}

function writeFile(
	path: string,
	content: string,
): void {
	return fs.writeFileSync(path, content, { encoding: 'utf8' })
}

function touchDirectories(
	filepath: string,
): string {
	const dirpath = fspath.dirname(filepath)

	if (!fs.existsSync(dirpath)) {
		fs.mkdirSync(dirpath, {
			recursive: true
		})
	}

	return filepath
}
