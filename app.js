require('dotenv').config()

const config = require('./config')

const fastify = require('fastify')(config.envConfig.server)
const path = require('path')

const fastify_graceful_shutdown = require('fastify-graceful-shutdown')
const fastify_helmet = require('fastify-helmet')
const fastify_rate_limit = require('fastify-rate-limit')
const fastify_cors = require('fastify-cors')
const fastify_formbody = require('fastify-formbody')
const fastify_multer = require('fastify-multer')
const fastify_static = require('fastify-static')

const sqlConnection = require('./src/infrastructures/sqlConnection')

if (config.env === 'development') {
    const fastify_routes = require('fastify-routes')

    fastify.register(fastify_routes)
}

fastify.register(fastify_graceful_shutdown)
fastify.register(fastify_helmet)
fastify.register(fastify_rate_limit, config.envConfig.rate_limit)
fastify.register(fastify_cors)
fastify.register(fastify_formbody)
fastify.register(fastify_multer.contentParser)
fastify.register(fastify_static, {
    root: path.join(__dirname, 'public'),
})
require('./src/routes')(fastify)

fastify.register(sqlConnection, config.dbConfig)

fastify.listen(config.port, config.host, function (err, address) {
    if (err) {
        fastify.log.error(err)
        fastify.close()
        process.abort()
    }

    if (config.env === 'development') {
        console.log(fastify.routes)
    } else {
        console.log(fastify.printRoutes())
    }
})
