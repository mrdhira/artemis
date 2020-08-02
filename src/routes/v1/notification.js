const authHelpers = require('../../helpers').auth;
const controllers = require('../../controllers');

module.exports = (fastify, options, next) => {
    fastify.route({
        method: 'POST',
        url: '/save',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.notification.saveUserToken(req, res)
    })

    fastify.route({
        method: 'POST',
        url: '/send',
        handler: (req, res) => controllers.notification.sendNotification(req, res)
    })

    next()
}
