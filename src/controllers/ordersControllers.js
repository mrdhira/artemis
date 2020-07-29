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
        const orderList = await services.orders.getOrderList(req.sql, id, user_type)

        return helpers.response(res, 200, 'OK', false, orderList)
    } catch (err) {
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
    console.log('request parameter: ', req.params)
    const { id } = req.params;

    try {
        const orders = await services.orders.getOrdersDetail(req.sql, id)
        if (orders.ordersNotFound) {
            return helpers.response(res, 404, 'Order not found.', false, {})
        } else {
            return helpers.response(res, 200, 'OK', false, orders)
        }
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
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
 * PUT /orders/status
 * @param {*} req 
 * @param {*} res 
 */
exports.updateStatusOrders = async (req, res) => {
    console.log('request body: ', req.body);
    const { order_id, status } = req.body

    if (typeof order_id !== 'number'  || (status < 2 || status > 5)) {
        return helpers.response(res, 422, 'order_id is not number or status not between 2 to 5', false, {})
    }

    if (!req.body.decoded.merchant_id) {
        return helpers.response(res, 403, 'Unauthorized.', false, {})
    }

    try {
        const orders = await services.orders.updateStatusOrders(req.sql, order_id, status)
        if (orders.ordersNotFound) {
            return helpers.response(res, 404, 'Order not found.', false, {})
        } else if (orders.ordersCompleted) {
            return helpers.response(res, 422, 'Order already completed.', false, {})
        } else if (orders.ordersStatusInvalid) {
            return helpers.response(res, 422, 'Order update status invalid.', false, {})
        } else {
            return helpers.response(res, 200, 'Update successfully', false, {})
        }
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
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
    const { order_id, rating, description } = req.body

    if (typeof order_id !== 'number') {
        return helpers.response(res, 422, 'order_id is not number', false, {})
    }

    if (typeof rating !== 'number') {
        return helpers.response(res, 422, 'rating is not number', false, {})
    }

    if (req.body.decoded.merchant_id) {
        return helpers.response(res, 403, 'Unauthorized.', false, {})
    }

    try {
        const reviews = await services.orders.giveOrdersRatings(req.sql, order_id, rating, description)
        if (reviews.ordersNotFound) {
            return helpers.response(res, 404, 'Order not found.', false, {})
        } else if (reviews.ordersNotCompleted) {
            return helpers.response(res, 422, 'Order not completed.', false, {})
        } else if (reviews.alreadyGiven) {
            return helpers.response(res, 422, 'Rating already given for this order.', false, {})
        } else {
            return helpers.response(res, 200, 'OK', false, {})
        }
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}
