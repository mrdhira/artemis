const services = require('../services')
const helpers = require('../helpers')
const USER_DATA = [
    'picture_id',
    'full_name',
    'email',
    'phone',
    'birth_date',
    'birth_place',
    'sex'
]

const MERCHANT_DATA = [
    'address',
    'operational_hour',
    'facility',
    'latitude',
    'longtitude',
]

const MERCHANT_SERVICE_DATA = [
    'name',
    'description',
    'price',
]

/**
 * POST /users/register
 * 
 * @desc
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.register = async (req, res) => {
    console.log('request body: ', req.body);
    const { full_name, email, phone, password, type, token: device_token } = req.body;

    try {
        const data = await services.users.register(req.sql, full_name, email, phone, password, type, device_token)
        if (data) {
            const tokenData = {
                id: data.user.id,
                email,
            }
            data.merchants ? tokenData.merchant_id = data.merchants.id : false
            const token = await helpers.auth.generateToken(tokenData);
            data.token = token

            return helpers.response(res, 200, 'OK', false, data);
        } else {
            return helpers.response(res, 422, 'User already exists.', false, {});
        }
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * POST /users/login
 * @param {*} req 
 * @param {*} res 
 */
exports.login = async (req, res) => {
    console.log('request body: ', req.body)
    const { email, password, type, token: device_token } = req.body

    try {
        const data = await services.users.login(req.sql, email, password, type, device_token)
        if (data) {
            if (data.invalidPassword) {
                return helpers.response(res, 422, 'Password not match.', false, {})
            } else if (data.merchantsNotFound) {
                return helpers.response(res, 404, 'Merchants not found.', false, {})
            }
            const tokenData = {
                id: data.user.id,
                email,
            }
            data.merchants ? tokenData.merchant_id = data.merchants.id : false
            const token = await helpers.auth.generateToken(tokenData);

            return helpers.response(res, 200, 'Login successfully.', false, {token});
        } else {
            return helpers.response(res, 404, 'User not found.', false, {})
        }
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * POST /users/logout
 * @param {*} req 
 * @param {*} res 
 */
exports.logout = async (req, res) => {
    console.log('request body: ', req.body)
    const { token: device_token } = req.body

    try {
        await services.users.logout(req.sql, req.body.decoded.id, device_token)
        return helpers.response(res, 200, 'OK', false, {})
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * GET /users/profile
 * @param {*} req 
 * @param {*} res 
 */
exports.getProfile = async (req, res) => {
    console.log('request body: ', req.body);
    const { id } = req.body.decoded

    if (req.body.decoded.merchant_id) {
        return helpers.response(res, 403, 'Unauthorized.', false, {})
    }

    try {
        const profile = await services.users.getProfile(req.sql, id);
        return helpers.response(res, 200, 'OK', false, profile);
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * PUT /users/profile
 * @param {*} req 
 * @param {*} res 
 */
exports.updateProfile = async (req, res) => {
    console.log('request body: ', req.body)

    try {
        const userData = {}
        const merchantData = {}

        for (const i of Object.keys(req.body)) {
            if (USER_DATA.includes(i)) {
                userData[i] = req.body[i]
            }
            if (MERCHANT_DATA.includes(i)) {
                merchantData[i] = req.body[i]
            }
        }

        if (req.body.decoded.merchant_id) {
            await services.users.updateProfile(req.sql, req.body.decoded.id, userData, req.body.decoded.merchant_id, merchantData)
        } else {
            await services.users.updateProfile(req.sql, req.body.decoded.id, userData, null, null)
        }

        return helpers.response(res, 200, 'Update successfully.', false, {})
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * PUT /users/password
 * @param {*} req 
 * @param {*} res 
 */
exports.changePassword = async (req, res) => {
    console.log('request body: ', req.body);
    const { oldPassword, newPasswoord } = req.body;
    const { id } = req.body.decoded

    try {
        const success = await services.users.changePassword(req.sql, id, oldPassword, newPasswoord)
        if (success.passwordNotMatch) {
            return helpers.response(res, 422, 'Password not match.', false, {})
        }

        return helpers.response(res, 200, 'Password update successfully.', false, {})
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * GET /users/profile/merchant
 * @param {*} req 
 * @param {*} res 
 */
exports.getProfileMerchant = async (req, res) => {
    console.log('request body: ', req.body);
    const { id, merchant_id } = req.body.decoded

    if (!req.body.decoded.merchant_id) {
        return helpers.response(res, 403, 'Unauthorized.', false, {})
    }

    try {
        const profile = await services.users.getProfileMerchant(req.sql, id, merchant_id);
        return helpers.response(res, 200, 'OK', false, profile);
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * POST /users/profile/merchant/treatment
 * @param {*} req 
 * @param {*} res 
 */
exports.merchantAddTreatment = async (req, res) => {
    console.log('request body: ', req.body)

    if (!req.body.decoded.merchant_id) {
        return helpers.response(res, 403, 'Unauthorized.', false, {})
    }

    try {
        const data = {}
        
        for (const i of Object.keys(req.body)) {
            if (MERCHANT_SERVICE_DATA.includes(i)) {
                data[i] = req.body[i]
            }
        }
        const merchantServices = await services.users.merchantAddTreatment(req.sql, req.body.decoded.merchant_id, data)

        return helpers.response(res, 200, 'Treatment added.', false, {merchantServices})
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * PUT /users/profile/merchant/treatment
 * @param {*} req 
 * @param {*} res 
 */
exports.merchantUpdateTreatment = async (req, res) => {
    console.log('request body: ', req.body);
    const { id } = req.body;

    if (!req.body.decoded.merchant_id) {
        return helpers.response(res, 403, 'Unauthorized.', false, {})
    }

    try {
        const data = {}
        
        for (const i of Object.keys(req.body)) {
            if (MERCHANT_SERVICE_DATA.includes(i)) {
                data[i] = req.body[i]
            }
        }

        await services.users.merchantUpdateTreatment(req.sql, id, data)

        return helpers.response(res, 200, 'Update successfully.', false, {})
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * DELETE /users/profile/merchant/treatment
 * @param {*} req 
 * @param {*} res 
 */
exports.merchantDeleteTreatment = async (req, res) => {
    console.log('request body: ', req.body);
    const { id } = req.body;

    if (!req.body.decoded.merchant_id) {
        return helpers.response(res, 403, 'Unauthorized.', false, {})
    }

    try {
        await services.users.merchantDeleteTreatment(req.sql, id)

        return helpers.response(res, 200, 'Delete successfully.', false, {})
    } catch(err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}
