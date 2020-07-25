const authHelpers = require('../../helpers').auth;
const controllers = require('../../controllers');

module.exports = (fastify, options, next) => {
    fastify.route({
        method: 'GET',
        url: '/',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.orders.getOrdersList(req, res),
    })

    fastify.route({
        method: 'GET',
        url: '/:id',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.orders.getOrdersDetail(req, res),
    })

    fastify.route({
        method: 'POST',
        url: '/',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.orders.createOrders(req, res),
    })

    fastify.route({
        method: 'PUT',
        url: '/approve',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.orders.approveOrders(req, res),
    })

    fastify.route({
        method: 'PUT',
        url: '/reject',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.orders.rejectOrders(req, res),
    })

    fastify.route({
        method: 'PUT',
        url: '/complete',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.orders.completeOrders(req, res),
    })

    fastify.route({
        method: 'PUT',
        url: '/status',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.orders.updateStatusOrders(req, res),
    })

    fastify.route({
        method: 'PUT',
        url: '/pet/records',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.orders.addPetMedicalRecords(req, res),
    })

    fastify.route({
        method: 'POST',
        url: '/ratings',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.orders.giveOrdersRatings(req, res),
    })

    next()
}
