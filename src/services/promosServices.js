const repository = require('../repository');
const helpers = require('../helpers')

/**
 * 
 * @param {*} req
 * @param {*} res
 */
exports.getPromosList = async (sql) => {
    const result = []
    const promosList = await repository.promos.getPromosList(sql)
    for (const promos of promosList) {
        promos.file = null
        if (promos.picture_id && promos.url) {
            promos.file = await helpers.readFile(promos.url)
        }
        result.unshift(promos)
    }
    return result
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getPromosDetail = async (sql, id) => {
    const promos = await repository.promos.getPromosDetail(sql, id)
    promos.file = null
    if (promos.picture_id && promos.url) {
        promos.file = await helpers.readFile(promos.url)
    }
    
    return promos
}
