const queryHelpers = require('../helpers').query

/**
 * 
 * @param {*} id 
 */
exports.getUserByID = (sql, id) => {
    try {
        return sql
            .query('SELECT * FROM users WHERE id = $1', [id])
            .then(data => data.rows ? data.rows[0] : null)
    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @param {*} email 
 */
exports.getUserByEmail = (sql, email) => {
    try {
        return sql
            .query('SELECT * FROM users WHERE email = $1', [email])
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
exports.createUser = async (sql, full_name, email, phone, password) => {
    try {
        await sql
            .query(
                queryHelpers
                    .insertQuery(
                        {full_name, email, phone, password}, 'users'),
                        [full_name, email, phone, password]
                );
        return this.getUserByEmail(sql, email)
    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @param {*} id 
 * @param {*} data 
 */
exports.updateUser = (sql, id, data) => {
    sql.query(queryHelpers.updateQuery(data, 'users', {id}), Object.values(data), (err, data) => {
        if (err) console.error(err)
        return err, data[0]
    })
}
