const fs = require('fs')

function loadSchema() {
    const expt = {}
    fs
        .readdirSync(__dirname)
        .forEach((dir) => {
            if (dir !== 'index.js') {
                const filepath = __dirname + '/' + dir
                const moduleName = dir.replace('.js', '')

                expt[moduleName] = require(filepath)
            }
        })
    return expt
}

module.exports = loadSchema()
