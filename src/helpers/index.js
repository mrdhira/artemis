// const S = require('fluent-schema');
const fs = require('fs');
const queryHelpers = require('./query');
const authHelpers = require('./auth');

exports.isArray = (arr) => {
    return (!!arr) && (arr.constructor === Array)
}

exports.isObject = (obj) => {
    return (!!obj) && (obj.constructor === Object)
}

exports.response = (res, code, message, error, data) => {
    res
        .code(code || 200)
        .type('application/json')
        .send({ code, message, error, data })
}

exports.fileFilter = (request, file, cb) => {
    console.log('File: ', file)

    if (file.mimetype.startsWith('image')) {
        request.body.invalidFileType = false;
        cb(null, true)
    } else {
        request.body.invalidFileType = true;
        request.body.fileType = file.mimetype;
        cb(null, false)
    }
    
}

exports.readFile = (path) => {
    return fs.readFileSync(path)
}

exports.query = queryHelpers;

exports.auth = authHelpers;
