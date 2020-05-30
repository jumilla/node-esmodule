
import meta from './meta'
import config from './config'
import project_ from './project'
import P from './platform'
import chalk from 'chalk'
import log from 'npmlog'



type Program = {
	directoryPath: string
}

	;
(function () {
	const program: Program = {
		directoryPath: '.'
	}

	// log.level = 'silly'

	if (process.argv.length >= 3) {
		program.directoryPath = process.argv[2]
	}

	launch(program)
})()

function launch(program: Program): void {
	const configFilePath = P.resolvePath(program.directoryPath, config.FILENAME)

	if (!P.testFileExists(configFilePath)) {
		log.error(meta.program, chalk.red('No config'))
		process.exit()
	}

	log.info(meta.program, chalk.green('ES Module builder'))
	log.info(meta.program, chalk.yellow('Version: ') + meta.version)

	const project = project_.load(configFilePath)

	log.verbose(meta.program, "...config loaded")

	log.silly(meta.program, project.config.toString())

	log.verbose(meta.program, chalk.yellow('Path: '), configFilePath)
	log.verbose(meta.program, chalk.yellow('Version: '), project.config.version)
	log.verbose(meta.program, chalk.yellow('Files: '), project.codePaths)

	project_.build(project)
}