const queryHelpers = require('../helpers').query

exports.getAllMerchants = (sql) => {
    try {
        return sql
            .query(`
                SELECT A.id, A.picture_id, A.full_name, A.email, A.phone
                    , B.id AS "merchant_id", B.address, B.operational_hour, B.facility, B.latitude, B.longtitude
                    , C.url
                    , D.ratings, D.total_ratings
                FROM users AS A
                JOIN user_merchants AS B
                    ON A.id = B.user_id
                LEFT JOIN pictures AS C
                    ON A.picture_id = C.id
                LEFT JOIN (
                    SELECT A.merchant_id
                        , COUNT(B.id) AS "total_ratings"
                        , SUM(B.rating) / COUNT(B.id) AS "ratings"
                    FROM orders AS A
                    JOIN order_reviews AS B
                        ON A.id = B.order_id
                    GROUP BY A.merchant_id
                ) AS D
                    ON B.id = D.merchant_id
                `)
            .then(data => {
                console.timeEnd('QueryTimeExec')
                return data.rows ? data.rows : []
            })
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
            .then(data => {
                console.timeEnd('QueryTimeExec')
                return data.rows ? data.rows[0] : null
            })
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

exports.getMerchantRatingsByMerchantID = (sql, merchant_id) => {
    try {
        return sql
            .query(`
                SELECT A.merchant_id
                    , COUNT(B.id) AS "total_ratings"
                    , SUM(B.rating) / COUNT(B.id) AS "ratings"
                FROM orders AS A
                JOIN order_reviews AS B
                    ON A.id = B.order_id
                WHERE A.merchant_id = $1
                GROUP BY A.merchant_id
            `, [merchant_id])
            .then(data => {
                console.timeEnd('QueryTimeExec')
                return data.rows ? data.rows : { merchant_id, total_ratings: 0, ratings: 0} 
            })
    } catch (err) {
        throw err
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
            .then(data => {
                console.timeEnd('QueryTimeExec')
                return data.rows ? data.rows[0] : null
            })
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
        console.timeEnd('QueryTimeExec')
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
            .then(data => {
                console.timeEnd('QueryTimeExec')
                return data.rows ? data.rows[0] : null
            })
    } catch (err) {
        throw err;
    }
}

exports.getMerchantsTreatmentsByMerchantID = (sql, merchant_id) => {
    try {
        return sql
            .query('SELECT * FROM merchant_services WHERE merchant_id = $1', [merchant_id])
            .then(data => {
                console.timeEnd('QueryTimeExec')
                return data.rows ? data.rows : []
            })
    } catch (err) {
        throw err
    }
}

exports.getMerchantsTreatmentsByID = (sql, id) => {
    try {
        return sql
            .query('SELECT * FROM merchant_services WHERE id = $1', [id])
            .then(data => {
                console.timeEnd('QueryTimeExec')
                return data.rows ? data.rows[0] : null 
            })
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
        console.timeEnd('QueryTimeExec')
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
        console.timeEnd('QueryTimeExec')
        return 1
    } catch (err) {
        throw err
    }
}

exports.deleteMerchantsTreatments = async (sql, id) => {
    try {
        await sql
            .query('DELETE FROM merchant_services WHERE id = $1', [id])
        console.timeEnd('QueryTimeExec')
        return 1
    } catch (err) {
        throw err
    }
}
