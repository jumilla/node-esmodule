
import meta from './meta'
import { FILENAME as CONFIG_FILENAME } from './config'
import project_ from './project'
import P from './platform'
import chalk from 'chalk'
import log from 'npmlog'



type Program = {
	directoryPath: string
}

export async function launch(
	program: Program,
) {
	// log.level = 'silly'

	const configFilePath = P.resolvePath(program.directoryPath, CONFIG_FILENAME)

	if (!P.testFileExists(configFilePath)) {
		log.error(meta.program, chalk.red('No config'))
		throw new Error()
	}

	log.info(meta.program, chalk.green('ES Module builder'))
	log.info(meta.program, chalk.yellow('Version: ') + meta.version)

	const project = project_.load(configFilePath)

	log.verbose(meta.program, "...config loaded")

	log.silly(meta.program, project.config.toString())

	log.verbose(meta.program, chalk.yellow('Path: '), configFilePath)
	log.verbose(meta.program, chalk.yellow('Version: '), project.config.version)
	log.verbose(meta.program, chalk.yellow('Files: '), project.codePaths)

	await project_.build(project)
}