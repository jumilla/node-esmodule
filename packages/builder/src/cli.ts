
import meta from './meta'
import config from './config'
import chalk from 'chalk'
import * as log from 'npmlog'
import tsc from './tsc'

// log.level = 'silly'

let directoryPath = '.'

if (process.argv.length >= 3) {
    directoryPath = process.argv[2]
}

if (!config.exists(config.resolvePath(directoryPath, config.FILENAME))) {
    log.error(meta.program, chalk.red('No config'))
    process.exit()
}

log.info(meta.program, chalk.green('ES Module builder'))
log.info(meta.program, chalk.yellow('Version: ') + meta.version)

const project = config.load(config.resolvePath(directoryPath, config.FILENAME))
log.verbose(meta.program, "...config loaded")
log.silly(meta.program, project.config.toString())
log.verbose(meta.program, chalk.yellow('Path: '), config.resolvePath(directoryPath, config.FILENAME))
log.verbose(meta.program, chalk.yellow('Version: '), project.config.version)
log.verbose(meta.program, chalk.yellow('Files: '), project.codePaths)



switch (project.config.compiler) {
    case 'typescript':
        tsc.compile(project)
        break

    default:
        log.error(meta.program, 'Invalid compiler specified.')
}