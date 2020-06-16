
import meta from './meta'
import { FILENAME as CONFIG_FILENAME } from './config'
import { load as loadProject, build as buildProject } from './project'
import P from './platform'
import chalk from 'chalk'
import log from 'npmlog'
import commander, { command } from 'commander'



type Program = {
	configFilePath: string
	logLevel?: string
}

const LOG_LEVELS = [
	"silly",
	"verbose",
	"info",
	//	"timing",
	//	"http",
	"notice",
	"warn",
	"error",
	"silent",
]

export function processCommandLine(
	args: string[],
): Program {
	commander
		.version(meta.version, '-v, --version')
		.arguments('[config]')
		.action(config => {
			commander.config = config ?? '.'
		})
		.option('-l, --log <level>', 'Log level', value => {
			value = value.toLowerCase()
			if (!LOG_LEVELS.includes(value)) {
				log.warn(meta.program, chalk.red('invalid log-level:'), chalk.white.bgRed(value))
				value = 'info'
			}
			return value
		})
		.parse(args)

	const configFilePath =
		P.testDirectoryExists(commander.config)
			? P.joinPath(commander.config, CONFIG_FILENAME)
			: commander.config

	return {
		configFilePath,
		logLevel: commander.log,
	}
}

export async function run(
	program: Program,
): Promise<void> {
	log.level = program.logLevel || 'info'

	const configFilePath = P.resolvePath(program.configFilePath)

	log.info(meta.program, chalk.green('ES Module builder'))
	log.info(meta.program, chalk.yellow('Version: ') + meta.version)
	log.info(meta.program, chalk.yellow('CWD: ') + process.cwd())
	log.info(meta.program, chalk.yellow('Config: ') + configFilePath)

	if (!P.testFileExists(configFilePath)) {
		log.error(meta.program, chalk.red('Config file not found:'), chalk.white.bgRed(configFilePath))
		throw new Error()
	}

	const project = loadProject(configFilePath)

	log.verbose(meta.program, "...config loaded")

	log.silly(meta.program, JSON.stringify(project.config, null, 2))

	log.verbose(meta.program, chalk.yellow('Path: '), configFilePath)
	log.verbose(meta.program, chalk.yellow('Version: '), project.config.version)
	log.verbose(meta.program, chalk.yellow('Files: '), project.codePaths)

	await buildProject(project)
}