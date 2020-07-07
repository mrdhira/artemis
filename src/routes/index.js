const fs = require('fs')

module.exports = (fastify) => {
    fs
        .readdirSync(__dirname)
        .forEach((dir) => {
            if (!~dir.indexOf('.js')) {
                const filepath = __dirname + '/' + dir
                fs
                    .readdirSync(filepath)
                    .forEach((file) => {
                        const basename = file.replace('.js', '')
                        fastify.register(require(filepath + '/' + basename), { prefix: `/${dir}/${basename}`})
                    })
            }
        })

    fastify.get('/ping', async (req, res) => {
        const client = await fastify.sql.connect()
        const db = await client.query('SELECT NOW()')
        
        client.release()

        return res
            .code(200)
            .type('application/json')
            .send({
                message: 'pong',
                now: db.rows[0].now
            })
    })
}
