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

    try {
        const client = await pool.connect()
        await client.query('SELECT NOW()')
        
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
