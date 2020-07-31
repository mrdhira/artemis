const repository = require('../repository');
const helpers = require('../helpers')

/**
 * 
 * @param {*} req
 * @param {*} res
 */
exports.getNewsList = async (sql) => {
    const result = []
    const newsList = await repository.news.getNewsList(sql)
    for (const news of newsList) {
        news.file = null
        if (news.picture_id && news.url) {
            news.file = await helpers.readFile(news.url)
        }
        result.shift(news)
    }
    return result
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getNewsDetail = async (sql, id) => {
    const news = await repository.news.getNewsDetail(sql, id)
    news.file = null
    if (news.picture_id && news.url) {
        news.file = await helpers.readFile(news.url)
    }

    return news
}
