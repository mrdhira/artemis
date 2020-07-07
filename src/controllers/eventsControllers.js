const services = require('../services');
const helpers = require('../helpers')

/**
 * GET /events/
 * @param {*} req
 * @param {*} res
 */
exports.getEventsList = async (req, res) => {
    console.log('request body: ', req.body);

    return helpers.response(res, 200, 'OK', false, {})
}

/**
 * GET /events/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.getEventsDetail = async (req, res) => {
    console.log('request body: ', req.body);

    return helpers.response(res, 200, 'OK', false, {})
}
