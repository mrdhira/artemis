const { v4: uuidv4 } = require('uuid')

module.exports = {
    server: {
        logger: {
            prettyPrint: true,
            redact: ['req.headers.authorization'],
            level: 'info',
            serializers: {
                    // res (res) {
                    //     console.log(Object.keys(res))
                    //     console.log(res._headerSent)
                    //     console.log(res._header)
                    //     // console.log('Response', res.headers)
                    // },
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
        requestIdHeader: 'X-Request-ID',
        requestIdLogLabel: 'reqId',
        genReqId: function (req) { return uuidv4() },
    },
    rate_limit: {
        global: true,
        max: 1000,
        whitelist: ['127.0.0.1', '0.0.0.0'],
        addHeaders: { // default show all the response headers when rate limit is reached
            'x-ratelimit-limit': true,
            'x-ratelimit-remaining': true,
            'x-ratelimit-reset': true,
            'retry-after': true
        }
    }
}
