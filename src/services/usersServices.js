const helpers = require('../helpers');
const repository = require('../repository');

/**
 * 
 * @param {*} full_name
 * @param {*} email
 * @param {*} phone
 * @param {*} password
 * @param {*} type
 */
exports.register = async (sql, full_name, email, phone, password, type) => {
    const data = {}
    try {
        const checkEmail = await repository.users.getUserByEmail(sql, email)
        console.log('CheckEmail: ', checkEmail);

        if (checkEmail) {
            return false;
        } else {
            data.user = await repository.users.createUser(sql, full_name, email, phone, password)
            console.log('UserCreated: ', data.user)

            if (type === 2) {
                data.merchants = await repository.merchants.createMerchants(sql, data.user.id)
                console.log('MerchantCreated: ', data.merchants)
            }
            
            return data
        }
    } catch (err) {
        throw err
    }
}

/**
 * 
 * @param {*} email 
 * @param {*} password 
 * @param {*} type
 */
exports.login = async (sql, email, password, type) => {
    const data = {};
    try {
        data.user = await repository.users.getUserByEmail(sql, email);
        console.log('CheckEmail: ', data.user);

        if (data.user) {
            if (password === data.user.password) {
                if (type === 2) {
                    data.merchants = await repository.merchants.getMerchantsByUserID(sql, data.user.id)
                    if (!data.merchants) {
                        return { merchantsNotFound: true }
                    }
                }
                return data
            }
            return { invalidPassword: true }
        } else {
            return false;
        }
    } catch (err) {
        throw err
    }
}

/**
 * 
 * @param {*} id 
 */
exports.getProfile = async (sql, id) => {
    const user = await repository.users.getUserByID(sql, id)
    let pictures = {}
    if (user.picture_id) {
        pictures = await repository.pictures.getById(sql, user.picture_id)
        pictures.file = null
        if (pictures.url) {
            pictures.file = await helpers.readFile(pictures.url)
        }
    }
    return { user, pictures }
}

/**
 * 
 * @param {*} id
 * @param {*} userData
 * @param {*} merchant_id
 * @param {*} merchantData
 */
exports.updateProfile = async (sql, id, userData, merchant_id = null, merchantData = null) => {
    userData.updated_at = new Date()

    const updateUser = await repository.users.updateUser(sql, id, userData)
    console.log('updateUser: ', updateUser)

    if (merchant_id) {
        merchantData.updated_at = new Date()
        const updateMerchant = await repository.merchants.updateMerchants(sql, merchant_id, merchantData)
        console.log('updateMerchant: ', updateMerchant)
    }

    return 1
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.changePassword = async (sql, id, oldPassword, newPasswoord) => {
    const user = await repository.users.getUserByID(sql, id)

    if (oldPassword !== user.password) {
        return { passwordNotMatch: true }
    }

    const update = await repository.users.updateUser(sql, id, { password: newPasswoord, update_at: new Date() })
    console.log('updatePassword: ', update);

    return 1
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getProfileMerchant = async (sql, id, merchant_id) => {
    const user = await repository.users.getUserByID(sql, id)
    const merchant = await repository.merchants.getMerchantsByID(sql, merchant_id)
    const merchantServices = await repository.merchants.getMerchantsTreatmentsByMerchantID(sql, merchant_id)
    return { user, merchant, merchantServices }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.merchantAddTreatment = (sql, merchant_id, data) => {
    data.merchant_id = merchant_id
    return repository.merchants.addMerchantsTreatments(sql, data)
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.merchantUpdateTreatment = async (sql, id, data) => {
    data.update_at = new Date()

    const updateTreatment = await repository.merchants.updateMerchantsTreatments(sql, id, data)
    console.log('updateTreatment: ', updateTreatment)

    return 1
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.merchantDeleteTreatment = async (sql, id) => {
    const deleteTreatment = await repository.merchants.deleteMerchantsTreatments(sql, id)
    console.log('deleteTreatment: ', deleteTreatment)

    return 1
}
