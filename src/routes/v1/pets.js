const authHelpers = require('../../helpers').auth;
const controllers = require('../../controllers');

module.exports = (fastify, options, next) => {
    fastify.route({
        method: 'GET',
        url: '/',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.pets.getPetsList(req, res),
    })

    fastify.route({
        method: 'GET',
        url: '/:id',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.pets.getPetsDetail(req, res),
    })

    fastify.route({
        method: 'POST',
        url: '/add',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.pets.addPets(req, res),
    })

    fastify.route({
        method: 'PUT',
        url: '/update',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.pets.updatePets(req, res),
    })

    fastify.route({
        method: 'DELETE',
        url: '/delete',
        preHandler: (req, res, done) => authHelpers.validateToken(req, res, done),
        handler: (req, res) => controllers.pets.deletePets(req, res),
    })

    next()
}
