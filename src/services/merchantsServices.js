const repository = require('../repository');

/**
 * 
 * @param {*} req
 * @param {*} res
 */
exports.getMerchantsList = async (sql) => {
    return repository.merchants.getAllMerchants(sql);
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
    return { user, merchant, merchantServices }
}
