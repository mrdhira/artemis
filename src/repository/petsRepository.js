const queryHelpers = require('../helpers').query

/**
 * 
 * @param {*} sql 
 * @param {*} id 
 */
exports.getPetsByID = (sql, id) => {
    try {
        return sql
            .query('SELECT * FROM user_pets WHERE id = $1', [id])
            .then(data => data.rows ? data.rows[0] : null)
    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @param {*} sql
 * @param {*} user_id
 */
exports.getPetsByUserID = (sql, user_id) => {
    try {
        return sql
            .query('SELECT * FROM user_pets WHERE user_id = $1', [user_id])
            .then(data => data.rows ? data.rows : [])
    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @param {*} sql 
 * @param {*} data 
 */
exports.addPets = async (sql, data) => {
    try {
        await sql
            .query(
                queryHelpers
                .insertQuery(
                    data, 'user_pets'),
                    Object.values(data)
                )   
        return this.getPetsByUserID(sql, data.user_id)
    } catch (err) {
        throw err
    }
}

/**
 * 
 * @param {*} sql 
 * @param {*} id 
 * @param {*} data 
 */
exports.updatePets = (sql, id, data) => {
    try {
        return sql
            .query(
                queryHelpers
                .updateQuery(
                    data, 'user_pets', {id}
                ), Object.values(data)
            )
            .then(data => data.rows ? data.rows[0] : null)
    } catch (err) {
        throw err
    }
}

/**
 * 
 * @param {*} sql 
 * @param {*} id 
 */
exports.deletePets = (sql, id) => {
    try {
        return sql
            .query('DELETE FROM user_pets WHERE id = $1', [id])
    } catch (err) {
        throw err
    }
}

exports.getMedicalRecordsByPetID = (sql, pet_id) => {
    try {
        return sql
            .query(`
                SELECT C.service_name, E.full_name AS "merchant_name", B.booking_datetime
                FROM order_pets AS A
                JOIN orders AS B
                    ON A.order_id = B."id"
                    AND B.status = 5
                JOIN order_pet_services AS C
                    ON A.id = C.order_pet_id
                    AND C.status = 1
                JOIN user_merchants AS D
                    ON B.merchant_id = D."id"
                JOIN users AS E
                    ON D.user_id = E.id
                WHERE A.pet_id = $1 AND A.status = 1
                ORDER BY B.booking_datetime ASC, C.service_name ASC            
            `, [pet_id])
            .then(data => data.rows ? data.rows : [])
    } catch (err) {
        throw err
    }
}
