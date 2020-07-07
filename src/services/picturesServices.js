const repository = require('../repository');

exports.save = (sql, path) => {
    return repository.pictures.create(sql, path)
}