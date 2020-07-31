const services = require('../services');
const helpers = require('../helpers')

/**
 * GET /promos/
 * @param {*} req
 * @param {*} res
 */
exports.getPromosList = async (req, res) => {
    console.log('request body: ', req.body);

    try {
        const promosList = await services.promos.getPromosList(req.sql)
        return helpers.response(res, 200, 'OK', false, promosList)
    } catch (error) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * GET /promos/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.getPromosDetail = async (req, res) => {
    console.log('request params: ', req.params);
    const { id } = req.params

    try {
        const promos = await services.promos.getPromosDetail(req.sql, id)

        if (!promos) {
            return helpers.response(res, 404, 'Promos not found.', false, {})
        } else {
            return helpers.response(res, 200, 'OK', false, promos)
        }
    } catch (error) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})        
    }
}
