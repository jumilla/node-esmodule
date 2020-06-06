#!/usr/bin/env node

const esmc = require('../lib/cli.js')

const program = {}

if (process.argv.length >= 3) {
    program.directoryPath = process.argv[2]
}

esmc.launch(program).catch(error => {
    // console.error(error)
    process.exit(1)
})

