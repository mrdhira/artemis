module.exports = {
    server: {
        logger: {
            prettyPrint: true,
            redact: ['req.headers.authorization'],
            level: 'info',
            serializers: {
                //     res (res) {
                //         console.log('Response')
                //         console.log(res)
                //     },
                req (req) {
                    return {
                        method: req.method,
                        url: req.url,
                        headers: req.headers,
                        hostname: req.hostname,
                        remoteAddress: req.ip,
                        remotePort: req.connection.remotePort
                    }
                }
            }
        },
        ignoreTrailingSlash: true,
        bodyLimit: 1048576,
        caseSensitive: false,
        ajv: {
            removeAdditional: true, // remove additional properties
            useDefaults: true, // replace missing properties and items with the values from corresponding default keyword
            coerceTypes: true, // change data type of data to match type keyword
            allErrors: true,   // check for all errors
            nullable: true,     // support keyword "nullable" from Open API 3 specification.
            plugin: []
        }
    },
    rate_limit: {
        global: true,
        max: 100,
        whitelist: [],
        addHeaders: { // default show all the response headers when rate limit is reached
            
        }
    }
}
