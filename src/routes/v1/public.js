const fs = require('fs')
const helpers = require('../../helpers')

module.exports = (fastify, options, next) => {
    fastify.route({
        method: "GET",
        url: '/pictures/:file',
        handler: (req, res) => {
            const filePath = req.raw.url.replace('/v1/', '')
            if (!fs.existsSync(filePath)) {
                console.log('File Not Found: ', filePath)
                return helpers.response(res, 404, 'File not found for this path ' + filePath, false, {})
            } else {
                console.log('File found.', filePath)
                console.log(filePath.replace('/public/', ''))
                return helpers.responseFile(res, 200, filePath.replace('public/', ''))
            }
        }
    })
    
    next()
}
