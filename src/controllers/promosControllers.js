const services = require('../services');
const helpers = require('../helpers')

/**
 * GET /promos/
 * @param {*} req
 * @param {*} res
 */
exports.getPromosList = async (req, res) => {
    console.log('request body: ', req.body);

    return helpers.response(res, 200, 'OK', false, {})
}

/**
 * GET /promos/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.getPromosDetail = async (req, res) => {
    console.log('request body: ', req.body);

    return helpers.response(res, 200, 'OK', false, {})
}
