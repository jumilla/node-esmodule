#!/usr/bin/env node

const esmc = require('../lib/cli.js')



try {
    esmc
        .run(esmc.processCommandLine(process.argv))
        .catch(error => {
            // console.error(error)
            process.exit(1)
        })
}
catch (error) {
    console.error(error)
    process.exit(1)
}