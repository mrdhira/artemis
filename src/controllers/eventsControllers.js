const services = require('../services');
const helpers = require('../helpers')

/**
 * GET /events/
 * @param {*} req
 * @param {*} res
 */
exports.getEventsList = async (req, res) => {
    console.log('request body: ', req.body);

    try {
        const eventsList = await services.events.getEventsList(req.sql)
        return helpers.response(res, 200, 'OK', false, eventsList)
    } catch (error) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

/**
 * GET /events/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.getEventsDetail = async (req, res) => {
    console.log('request params: ', req.params);
    const { id } = req.params

    try {
        const events = await services.events.getEventsDetail(req.sql, id)

        if (!events) {
            return helpers.response(res, 404, 'Events not found.', false, {})
        } else {
            return helpers.response(res, 200, 'OK', false, events)
        }
    } catch (error) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})        
    }
}
