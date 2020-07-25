
exports.insertQuery = (data, table) => {
    const keys = Object.keys(data)
    let query = ''
  
    for (let i = 1; i <= keys.length; ++i) {
      query += `$${i},`
    }
  
    query = query.substr(0, query.length - 1)
    return `INSERT INTO ${table} (${keys.join(',')}) VALUES (${query}) RETURNING *`
}
  
  exports.updateQuery = (data, table, where) => {
    const keys = Object.keys(data)
    const keysWhere = Object.entries(where)
    let query = ''
    let queryWhere = ''
    let i = 1
  
    for (const key of keys) {
      query += `${key} = $${i},`
      ++i
    }
  
    for (const [key, val] of keysWhere) {
      queryWhere += `${key} = '${val}' AND `
    }
  
    query = query.substr(0, query.length - 1)
    queryWhere = queryWhere.substr(0, queryWhere.length - 5)
    return `UPDATE ${table} SET ${query} WHERE ${queryWhere}`
}
  