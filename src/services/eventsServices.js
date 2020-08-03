const repository = require('../repository');
const helpers = require('../helpers')

/**
 * 
 * @param {*} req
 * @param {*} res
 */
exports.getEventsList = async (sql) => {
    const result = []
    const eventsList = await repository.events.getEventsList(sql)
    for (const events of eventsList) {
        events.file = null
        if (events.picture_id && events.url) {
            events.file = await helpers.readFile(events.url)
        }
        result.push(events)
    }
    return result
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getEventsDetail = async (sql, id) => {
    const events = await repository.events.getEventsDetail(sql, id)
    events.file = null
    if (events.picture_id && events.url) {
        events.file = await helpers.readFile(events.url)
    }

    return events
}
