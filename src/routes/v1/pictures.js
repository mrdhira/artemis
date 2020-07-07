const helpers = require('../../helpers');
const controllers = require('../../controllers');
const multer = require('fastify-multer');
const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: {
        fileSize: 10485760
    },
    fileFilter: helpers.fileFilter
})

module.exports = (fastify, options, next) => {
    fastify.route({
        method: 'POST',
        url: '/',
        preHandler: upload.single('file'),
        handler: (req, res) => controllers.pictures.upload(req, res)
    })
    
    next()
}
