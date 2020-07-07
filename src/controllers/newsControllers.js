const services = require('../services');
const helpers = require('../helpers')

/**
 * GET /news/
 * @param {*} req
 * @param {*} res
 */
exports.getNewsList = async (req, res) => {
    console.log('request body: ', req.body);

    return helpers.response(res, 200, 'OK', false, {})
}

/**
 * GET /news/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.getNewsDetail = async (req, res) => {
    console.log('request body: ', req.body);

    return helpers.response(res, 200, 'OK', false, {})
}
