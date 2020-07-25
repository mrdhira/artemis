const jwt = require('jsonwebtoken');
const helpers = require('./index');
const privateKey = 'nbznpaSXgj';

exports.generateToken = async (data) => {
    const token = await jwt.sign(data, privateKey, {
        expiresIn: '24h'
    });

    return token;
}

exports.validateToken = async (req, res, done) => {
    const token = req.headers['authorization'] ? req.headers['authorization'].replace('Bearer ', '') : '';

    if (token == '') {
        return helpers.response(res, 401, 'Unauthorized, invalid access token.', false, {})
    }

    try {
        const decoded = await jwt.verify(token, privateKey);

        req.body 
            ? req.body.decoded = decoded
            : req.body = { decoded }

        return
    } catch (err) {
        console.log('ErrValidateToken: ', err)
        if (err.name == 'TokenExpiredError') {
            return helpers.response(res, 403, err.name, false, err)
        } else if (err.name == 'JsonWebTokenError') {
            return helpers.response(res, 401, err.name, false, err)
        }
        return helpers.response(res, 500, 'Internal server error.', true, err)
    }
    
}
