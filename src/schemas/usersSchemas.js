const S = require('fluent-schema')
const helpers = require('../helpers')

/**
 * Validate incoming & outcoming data
 * schema
 *  body
 *  querystring
 *  params
 *  headers
 */

const register = {
    body: 
        S.object()
            .prop(
                'full_name',
                S.string()
                    .required()
            )
            .prop(
                'email',
                S.string()
                    .format(S.FORMATS.EMAIL)
                    .required()
            )
            .prop(
                'phone',
                S.string()
                    .required()
            )
            .prop(
                'password',
                S.string()
                    .required()
            )
    ,
    response: {
        200: helpers.common_response_schema,
    }
}

module.exports = {
    register
}
