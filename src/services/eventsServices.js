const repository = require('../repository');
const helpers = require('../helpers')

/**
 * 
 * @param {*} req
 * @param {*} res
 */
exports.getEventList = async (sql) => {
    const result = []
    const eventsList = await repository.events.geteventsList(sql)
    for (const events of eventsList) {
        events.file = null
        if (events.picture_id && events.url) {
            events.file = await helpers.readFile(events.url)
        }
        result.shift(events)
    }
    return result
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getEventDetail = async (sql, id) => {
    const events = await repository.events.geteventsDetail(sql, id)
    events.file = null
    if (events.picture_id && events.url) {
        events.file = await helpers.readFile(events.url)
    }

    return events
}
