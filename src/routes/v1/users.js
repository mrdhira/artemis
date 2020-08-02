const schema = require('../../schemas');
const authHelpers = require('../../helpers').auth;
const controllers = require('../../controllers');

module.exports = (fastify, options, next) => {
    fastify.route({
        method: 'POST',
        url: '/register',
        handler: (req, res) => controllers.users.register(req, res)
    })

    fastify.route({
        method: 'POST',
        url: '/login',
        handler: (req, res) => controllers.users.login(req, res)
    })

    fastify.route({
        method: 'POST',
        url: '/logout',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.users.logout(req, res)
    })

    fastify.route({
        method: 'GET',
        url: '/profile',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.users.getProfile(req, res)
    })

    fastify.route({
        method: 'PUT',
        url: '/profile',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.users.updateProfile(req, res)
    })

    fastify.route({
        method: 'PUT',
        url: '/profile/password',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.users.changePassword(req, res)
    })

    fastify.route({
        method: 'GET',
        url: '/profile/merchant',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.users.getProfileMerchant(req, res)
    })

    fastify.route({
        method: 'POST',
        url: '/profile/merchant/treatment',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.users.merchantAddTreatment(req, res)
    })

    fastify.route({
        method: 'PUT',
        url: '/profile/merchant/treatment',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.users.merchantUpdateTreatment(req, res)
    })

    fastify.route({
        method: 'DELETE',
        url: '/profile/merchant/treatment',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.users.merchantDeleteTreatment(req, res)
    })

    next()
}
