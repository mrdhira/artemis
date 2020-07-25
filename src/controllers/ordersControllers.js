const services = require('../services');
const helpers = require('../helpers')

/**
 * GET /orders/
 * @param {*} req 
 * @param {*} res 
 */
exports.getOrdersList = async (req, res) => {
    console.log('request body: ', req.body);

    try {
        const id = req.body.decoded.merchant_id ? req.body.decoded.merchant_id : req.body.decoded.id
        const user_type = req.body.decoded.merchant_id ? 2 : 1
        console.log(id)
        const orderList = await services.orders.getOrderList(req.sql, id, user_type)

        return helpers.response(res, 200, 'OK', false, orderList)
    } catch (error) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
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
    console.log('request body: ', req.body)
    const { merchant_id, booking_datetime, pets } = req.body
    const { id } = req.body.decoded

    if (req.body.decoded.merchant_id) {
        return helpers.response(res, 403, 'Unauthorized.', false, {})
    }

    try {
        const orders = await services.orders.createOrders(req.sql, id, merchant_id, booking_datetime, pets)
        return helpers.response(res, 200, 'OK', false, orders)
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
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
