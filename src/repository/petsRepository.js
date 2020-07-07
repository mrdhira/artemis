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
