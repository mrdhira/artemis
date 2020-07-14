const repository = require('../repository');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getPetsList = async (sql, user_id) => {
    const pets = await repository.pets.getPetsByUserID(sql, user_id)
    let pictures = {}
    if (pets.picture_id) {
        pictures = await repository.pictures.getById(sql, pets.picture_id)
        pictures.file = null
        if (pictures.url) {
            pictures.file = await helpers.readFile(pictures.url)
        }
    }

    return { pets, pictures }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getPetsDetail = async (sql, id) => {
    const pets = await repository.pets.getPetsByID(sql, id)
    let pictures = {}
    if (pets.picture_id) {
        pictures = await repository.pictures.getById(sql, pets.picture_id)
        pictures.file = null
        if (pictures.url) {
            pictures.file = await helpers.readFile(pictures.url)
        }
    }
    return { pets, pictures }
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
