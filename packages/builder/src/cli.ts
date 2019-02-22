
import meta from './meta'
import config from './config'
import chalk from 'chalk'
import tsc from './tsc'

console.log(chalk.green('ES Module builder'))
console.log(chalk.yellow('Version: ') + meta.version)

let directoryPath = '.'

if (process.argv.length >= 3) {
    directoryPath = process.argv[2]
}

if (!config.exists(config.resolvePath(directoryPath, config.FILENAME))) {
    console.log(chalk.red('Error: No config'))
    process.exit()
}

const project = config.load(config.resolvePath(directoryPath, config.FILENAME))
console.log("...config loaded")
console.log(project.config)
console.log(chalk.yellow('Path: '), config.resolvePath(directoryPath, config.FILENAME))
console.log(chalk.yellow('Version: '), project.config.version)
console.log(chalk.yellow('Files: '), project.codePaths)



switch (project.config.compiler) {
    case 'typescript':
        tsc.compile(project)
        break

    default:
        console.error('Invalid compiler specified.')
}