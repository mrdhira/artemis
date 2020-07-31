exports.getEventsList = (sql) => {
    try {
        return sql
            .query(`
                SELECT A.*
                    , B.url
                FROM events AS A
                JOIN pictures AS B
                    ON A.picture_id = B.id
                ORDER BY created_at DESC
            `)
            .then(data => data.rows ? data.rows : [])
    } catch (err) {
        throw err
    }
}

exports.getEventsDetail = (sql, id) => {
    try {
        return sql
            .query(`
                SELECT A.*
                    , B.url
                FROM events AS A
                JOIN pictures AS B
                    ON A.picture_id = B.id
                WHERE A.id = $1 LIMIT 1
            `, [id])
            .then(data => data.rows ? data.rows[0] : null)
    } catch (err) {
        throw err
    }
}
