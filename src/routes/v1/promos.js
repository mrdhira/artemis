const schema = require('../../schemas');
const authHelpers = require('../../helpers').auth;
const controllers = require('../../controllers');

module.exports = (fastify, options, next) => {
    fastify.route({
        method: 'GET',
        url: '/',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.promos.getPromosList(req, res)
    })

    fastify.route({
        method: 'GET',
        url: '/:id',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.promos.getPromosDetail(req, res)
    })

    next()
}
