const queryHelpers = require('../helpers').query

/**
 * 
 * @param {*} id 
 */
exports.getUserByID = (sql, id) => {
    try {
        return sql
            .query('SELECT * FROM users WHERE id = $1', [id])
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
 * @param {*} email 
 */
exports.getUserByEmail = (sql, email) => {
    try {
        return sql
            .query('SELECT * FROM users WHERE email = $1', [email])
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
exports.createUser = async (sql, full_name, email, phone, password) => {
    try {
        await sql
            .query(
                queryHelpers
                    .insertQuery(
                        {full_name, email, phone, password}, 'users'),
                        [full_name, email, phone, password]
                );
        console.timeEnd('QueryTimeExec')
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
exports.updateUser = async (sql, id, data) => {
    try {
        await sql
            .query(
                queryHelpers
                    .updateQuery(data, 'users', {id}),
                    Object.values(data)
            )
        console.timeEnd('QueryTimeExec')
        return 1
    } catch (err) {
        throw err
    }
}

exports.getActiveUserTokenByUserID = (sql, user_id) => {
    try {
        return sql
            .query(`
                SELECT * FROM user_tokens WHERE user_id = $1 AND status = 1 ORDER BY created_at DESC
            `, [user_id])
            .then(data => {
                console.timeEnd('QueryTimeExec')
                return data.rows ? data.rows : []
            })
    } catch (err) {
        throw err
    }
}

exports.getUserTokenByUserIDAndToken = (sql, user_id, token) => {
    try {
        return sql
            .query(`
                SELECT * FROM user_tokens WHERE user_id = $1 AND token = $2
            `, [user_id, token])
            .then(data => {
                console.timeEnd('QueryTimeExec')
                return data.rows ? data.rows[0] : null
            })
    } catch (err) {
        throw err
    }
}

exports.insertUserToken = (sql, user_id, token, status) => {
    try {
        return sql
            .query(
                queryHelpers
                    .insertQuery(
                        {user_id, token, status}, 'user_tokens'),
                        [user_id, token, status]
            )
            .then(data => {
                console.timeEnd('QueryTimeExec')
                return data.rows[0]
            })
    } catch (err) {
        throw err
    }
}

exports.updateUserToken = async (sql, id, status) => {
    try {
        await sql
            .query(
                queryHelpers
                    .updateQuery(
                        {status}, 'user_tokens', {id}),
                        [status]
            )
        console.timeEnd('QueryTimeExec')
        return 1
    } catch (err) {
        throw err
    }   
}