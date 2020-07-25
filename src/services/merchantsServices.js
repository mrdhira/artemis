const repository = require('../repository');
const helpers = require('../helpers')

/**
 * 
 * @param {*} req
 * @param {*} res
 */
exports.getMerchantsList = async (sql) => {
    const result = []
    const merchantList = await repository.merchants.getAllMerchants(sql);
    for (let merchant of merchantList) {
        merchant.file = null
        if (merchant.picture_id && merchant.url) {
            pictures.file = await helpers.readFile(pictures.url)
        }
        result.push(merchant)
    }
    return result;
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
        pictures.file = null
        if (pictures.url) {
            pictures.file = await helpers.readFile(pictures.url)
        }
    }
    return { user, merchant, merchantServices, pictures }
}
