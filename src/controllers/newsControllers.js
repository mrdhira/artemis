const services = require('../services');
const helpers = require('../helpers')

/**
 * GET /news/
 * @param {*} req
 * @param {*} res
 */
exports.getNewsList = async (req, res) => {
    console.log('request body: ', req.body);

    try {
        const newsList = await services.news.getNewsList(req.sql)
        return helpers.response(res, 200, 'OK', false, newsList)
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * GET /news/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.getNewsDetail = async (req, res) => {
    console.log('request params: ', req.params);
    const { id } = req.params

    try {
        const news = await services.news.getNewsDetail(req.sql, id)

        if (!news) {
            return helpers.response(res, 404, 'News not found.', false, {})
        } else {
            return helpers.response(res, 200, 'OK', false, news)
        }
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})        
    }
}
