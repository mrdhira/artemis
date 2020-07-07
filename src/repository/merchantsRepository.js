const queryHelpers = require('../helpers').query

exports.getAllMerchants = (sql) => {
    try {
        return sql
            .query(`
                SELECT A.id, A.picture_id, A.full_name, A.email, A.phone
                , B.id AS "merchant_id", B.address, B.operational_hour, B.facility, B.latitude, B.longtitude
                FROM users AS A
                JOIN user_merchants AS B
                ON A.id = B.user_id`)
            .then(data => data.rows ? data.rows : [])
    } catch (err) {
        throw err;
    }
}

exports.getMerchantsByIDWithUsers = (sql, id) => {
    try {
        return sql
            .query(`
                SELECT A.id, A.picture_id, A.full_name, A.email, A.phone
                , B.id AS "merchant_id", B.address, B.operational_hour, B.facility, B.latitude, B.longtitude
                FROM users AS A
                JOIN user_merchants AS B
                ON A.id = B.user_id
                WHERE B.id = $1`, [id])
            .then(data => data.rows ? data.rows[0] : null)
    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @param {*} id 
 */
exports.getMerchantsByID = (sql, id) => {
    try {
        return sql
            .query('SELECT * FROM user_merchants WHERE id = $1', [id])
            .then(data => data.rows ? data.rows[0] : null)
    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @param {*} id 
 */
exports.getMerchantsByUserID = (sql, user_id) => {
    try {
        return sql
            .query('SELECT * FROM user_merchants WHERE user_id = $1', [user_id])
            .then(data => data.rows ? data.rows[0] : null)
    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @param {*} full_name 
 * @param {*} email 
 * @param {*} phone 
 * @param {*} password 
 */
exports.createMerchants = async (sql, user_id, address = null, operational_hour = null, facility = null, latitude = null, longtitude = null) => {
    try {
        await sql
            .query(
                queryHelpers
                .insertQuery(
                    {user_id, address, operational_hour, facility, latitude, longtitude}, 'user_merchants'),
                    [user_id, address, operational_hour, facility, latitude, longtitude]
                )
        return this.getMerchantsByUserID(sql, user_id)
    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @param {*} id 
 * @param {*} data 
 */
exports.updateMerchants = (sql, id, data) => {
    try {
        return sql
            .query(
                queryHelpers
                .updateQuery(
                    data, 'user_merchants', {id}
                ), Object.values(data)
            )
            .then(data => data.rows ? data.rows[0] : null)
    } catch (err) {
        throw err;
    }
}

exports.getMerchantsTreatmentsByMerchantID = (sql, merchant_id) => {
    try {
        return sql
            .query('SELECT * FROM merchant_services WHERE merchant_id = $1', [merchant_id])
            .then(data => data.rows ? data.rows : [])
    } catch (err) {
        throw err
    }
}

exports.getMerchantsTreatmentsByID = (sql, id) => {
    try {
        return sql
            .query('SELECT * FROM merchant_services WHERE id = $1', [id])
            .then(data => data.rows ? data.rows[0] : null )
    } catch (err) {
        throw err
    }
}

exports.addMerchantsTreatments = async (sql, data) => {
    try {
        await sql
            .query(
                queryHelpers
                .insertQuery(
                    data, 'merchant_services'),
                    Object.values(data)
                )   
        return this.getMerchantsTreatmentsByMerchantID(sql, data.merchant_id)
    } catch (err) {
        throw err
    }
}

exports.updateMerchantsTreatments = async (sql, id, data) => {
    try {
        await sql
            .query(
                queryHelpers
                .updateQuery(
                    data, 'merchant_services', {id}),
                    Object.values(data)
            )
            .then(data => data.rows ? data.rows[0] : null)
    } catch (err) {
        throw err
    }
}

exports.deleteMerchantsTreatments = (sql, id) => {
    try {
        return sql
            .query('DELETE FROM merchant_services WHERE id = $1', [id])
    } catch (err) {
        throw err
    }
}
