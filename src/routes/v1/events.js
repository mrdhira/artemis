const schema = require('../../schemas');
const authHelpers = require('../../helpers').auth;
const controllers = require('../../controllers');

module.exports = (fastify, options, next) => {
    fastify.route({
        method: 'GET',
        url: '/',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.events.getEventsList(req, res)
    })

    fastify.route({
        method: 'GET',
        url: '/:id',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.events.getEventsDetail(req, res)
    })

    next()
}
