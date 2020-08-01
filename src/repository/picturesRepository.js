const queryHelpers = require('../helpers').query

exports.getById = (sql, id) => {
    try {
        return sql
            .query('SELECT * FROM pictures WHERE id = $1', [id])
            .then(data => {
                console.timeEnd('QueryTimeExec')
                return data.rows ? data.rows[0] : null
            })
    } catch (err) {
        throw err;
    }
}

exports.getByUrl = (sql, url) => {
    try {
        return sql
            .query('SELECT * FROM pictures WHERE url = $1', [url])
            .then(data => {
                console.timeEnd('QueryTimeExec')
                return data.rows ? data.rows[0] : null
            })
    } catch (err) {
        throw err;
    }
}

exports.create = async (sql, url) => {
    try {
        await sql
            .query(
                queryHelpers
                    .insertQuery(
                        {url}, 'pictures'),
                        [url]
                );
        console.timeEnd('QueryTimeExec')
        return this.getByUrl(sql, url)
    } catch (err) {
        throw err;
    }
}

