const fp = require('fastify-plugin')
const { Pool } = require('pg')

async function sqlConnector (fastify, options) {
    const dbConfig = options
    delete options

    const pool = new Pool({
        user: dbConfig.DB_USER,
        host: dbConfig.DB_HOST,
        database: dbConfig.DB_NAME,
        password: dbConfig.DB_PASS,
        port: dbConfig.DB_PORT
    })

    pool.on('error', (err, client) => {
        fastify.log.error('Unexpected error on idle client', err)
        client.release()
        process.exit(-1)
    })

    pool.on('connect', (client) => {
        fastify.log.info('SQL connect event')
    })

    pool.on('acquire', (client) => {
        fastify.log.info('SQL acquire event')
        console.time('QueryTimeExec')
    })

    pool.on('remove', (client) => {
        fastify.log.info('SQL remove event')
    })

    try {
        const client = await pool.connect()
        await client.query('SELECT NOW()')
        console.timeEnd('QueryTimeExec')
        
        fastify.log.info('SQL Connected!')
        await client.release()

        fastify.decorate('sql', pool)
        fastify.decorateRequest('sql', pool)
    } catch (err) {
        fastify.log.error(err)
        fastify.close()
        process.abort()
    }
}

module.exports = fp(sqlConnector)
