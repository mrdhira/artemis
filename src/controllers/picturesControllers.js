const fs = require('fs');
const moment = require('moment');
const helpers = require('../helpers');
const services = require('../services');

exports.upload = async (req, res) => {
    console.log('request body: ', req.body)
    console.log('request file: ', req.file)

    if (!req.file || req.body.invalidFileType) {
        return helpers.response(res, 422, 'File type not supported.', true, { fileType: req.body.fileType })
    }

    try {
        const dirPath = 'public/pictures/';
        const dateTimeNow = moment().format('DDMMYYYY-HHmmss-');
        const fileName = req.file.originalname;
        const path = dirPath+dateTimeNow+fileName

        try {
            await fs.writeFileSync(path, req.file.buffer)
        } catch (err) {
            console.error(err)
            return helpers.response(res, 500, 'Error when writing files.', true, {})
        }

        const pictures = await services.pictures.save(req.sql, path)

        return helpers.response(res, 200, 'OK', false, pictures)
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}