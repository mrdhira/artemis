const services = require('../services');
const helpers = require('../helpers')

/**
 * GET /orders/
 * @param {*} req 
 * @param {*} res 
 */
exports.getOrdersList = async (req, res) => {
    console.log('request body: ', req.body);

    return helpers.response(res, 200, 'OK', false, {})
}

/**
 * GET /orders/history
 * @param {*} req 
 * @param {*} res 
 */
exports.getOrdersHistoryList = async (req, res) => {
    console.log('request body: ', req.body);

    return helpers.response(res, 200, 'OK', false, {})
}

/**
 * GET /orders/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.getOrdersDetail = async (req, res) => {
    console.log('request body: ', req.body);

    return helpers.response(res, 200, 'OK', false, {})
}

/**
 * POST /orders/
 * @param {*} req 
 * @param {*} res 
 */
exports.createOrders = async (req, res) => {
    console.log('request body: ', req.body);

    return helpers.response(res, 200, 'OK', false, {})
}

/**
 * PUT /orders/approve
 * @param {*} req 
 * @param {*} res 
 */
exports.approveOrders = async (req, res) => {
    console.log('request body: ', req.body);

    return helpers.response(res, 200, 'OK', false, {})
}

/**
 * PUT /orders/reject
 * @param {*} req 
 * @param {*} res 
 */
exports.rejectOrders = async (req, res) => {
    console.log('request body: ', req.body);

    return helpers.response(res, 200, 'OK', false, {})
}

/**
 * PUT /orders/complete
 * @param {*} req 
 * @param {*} res 
 */
exports.completeOrders = async (req, res) => {
    console.log('request body: ', req.body);

    return helpers.response(res, 200, 'OK', false, {})
}

/**
 * PUT /orders/status
 * @param {*} req 
 * @param {*} res 
 */
exports.updateStatusOrders = async (req, res) => {
    console.log('request body: ', req.body);

    return helpers.response(res, 200, 'OK', false, {})
}

/**
 * PUT /orders/pet/records
 * @param {*} req 
 * @param {*} res 
 */
exports.addPetMedicalRecords = async (req, res) => {
    console.log('request body: ', req.body);

    return helpers.response(res, 200, 'OK', false, {})
}

/**
 * POST /orders/ratings
 * @param {*} req 
 * @param {*} res 
 */
exports.giveOrdersRatings = async (req, res) => {
    console.log('request body: ', req.body);

    return helpers.response(res, 200, 'OK', false, {})
}
