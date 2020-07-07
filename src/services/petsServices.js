const repository = require('../repository');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getPetsList = (sql, user_id) => {
    return repository.pets.getPetsByUserID(sql, user_id)
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getPetsDetail = (sql, id) => {
    return repository.pets.getPetsByID(sql, id)
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.addPets = (sql, data) => {
    return repository.pets.addPets(sql, data)
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.updatePets = (sql, id, data) => {
    return repository.pets.updatePets(sql, id, data)
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.deletePets = (sql, id) => {
    return repository.pets.deletePets(sql, id) 
}
