const services = require('../services');
const helpers = require('../helpers');
const PET_DATA = [
    'picture_id',
    'type',
    'name',
    'breed',
    'sex',
    'weight',
    'date_of_birth',
    'body_color',
    'eye_color',
    'microchip_id'
]

/**
 * GET /pets/
 * @param {*} req 
 * @param {*} res 
 */
exports.getPetsList = async (req, res) => {
    console.log('request body: ', req.body);
    const { id } = req.body.decoded

    try {
        const data = await services.pets.getPetsList(req.sql, id)
        return helpers.response(res, 200, 'OK', false, data)
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * GET /pets/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.getPetsDetail = async (req, res) => {
    console.log('request body: ', req.body);
    console.log('request parameter: ', req.params)
    const { id } = req.params

    try {
        const data = await services.pets.getPetsDetail(req.sql, id)
        if (data.petNotFound) {
            return helpers.response(res, 404, 'Pet not found.', false, {})
        } else {
            return helpers.response(res, 200, 'OK', false, data)   
        }        
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * POST /pets/add
 * @param {*} req 
 * @param {*} res 
 */
exports.addPets = async (req, res) => {
    console.log('request body: ', req.body);
    const { id } = req.body.decoded

    try {
        const petData = {}

        for (const i of Object.keys(req.body)) {
            if (PET_DATA.includes(i)) {
                petData[i] = req.body[i]
            }
        }

        petData.user_id = id
        const data = await services.pets.addPets(req.sql, petData)

        return helpers.response(res, 200, 'Pet added.', false, data)
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * PUT /pets/update
 * @param {*} req 
 * @param {*} res 
 */
exports.updatePets = async (req, res) => {
    console.log('request body: ', req.body)
    const { id } = req.body

    try {
        const petData = {}

        for (const i of Object.keys(req.body)) {
            if (PET_DATA.includes(i)) {
                petData[i] = req.body[i]
            }
        }

        const data = await services.pets.updatePets(req.sql, id, petData)

        return helpers.response(res, 200, 'Update successfully.', false, data)
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * DELETE /pets/delete
 * @param {*} req 
 * @param {*} res 
 */
exports.deletePets = async (req, res) => {
    console.log('request body: ', req.body)
    const { id } = req.body

    try {
        await services.pets.deletePets(req.sql, id)

        return helpers.response(res, 200, 'Delete successfully.', false, {})
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}