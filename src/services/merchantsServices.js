const repository = require('../repository');
const helpers = require('../helpers')

const MERCHANT_ORDER_BY = [
    'ratings'
]

/**
 * 
 * @param {*} req
 * @param {*} res
 */
exports.getMerchantsList = async (sql, query) => {
    const result = []
    let orderby = ''
    if (
        (query.filter && MERCHANT_ORDER_BY.includes(query.filter))
        &&
        query.order && (query.order.toUpperCase() === 'ASC' || query.order.toUpperCase() === 'DESC')
    ) {
        if (query.filter)
        orderby = `ORDER BY ${query.filter} ${query.order}`
    }

    const merchantList = await repository.merchants.getAllMerchants(sql, orderby);

    return merchantList
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getMerchantsDetail = async (sql, id) => {
    const merchant = await repository.merchants.getMerchantsByID(sql, id)
    if (!merchant) {
        return { merchantsNotFound: true }
    }

    const merchantServices = await repository.merchants.getMerchantsTreatmentsByMerchantID(sql, id)
    const user = await repository.users.getUserByID(sql, merchant.user_id)
    let pictures = {}
    if (user.picture_id) {
        pictures = await repository.pictures.getById(sql, user.picture_id)
    }
    const merchantRatings = await repository.merchants.getMerchantRatingsByMerchantID(sql, id)

    return { user, merchant, merchantServices, pictures, merchantRatings }
}
