const services = require('../services');
const helpers = require('../helpers')

/**
 * GET /merchants/
 * @param {*} req 
 * @param {*} res 
 */
exports.getMerchantsList = async (req, res) => {
    console.log('request body: ', req.body);

    try {
        const data = await services.merchants.getMerchantsList(req.sql)
        return helpers.response(res, 200, 'OK', false, data)
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * GET /merchants/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.getMerchantsDetail = async (req, res) => {
    console.log('request body: ', req.body);
    console.log('request parameter: ', req.params)
    const { id } = req.params

    try {
        const data = await services.merchants.getMerchantsDetail(req.sql, id)
        if (data.merchantsNotFound) {
            return helpers.response(res, 404, 'Merchants not found.', false, {})
        }
        
        return helpers.response(res, 200, 'OK', false, data ? data : {})
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}
