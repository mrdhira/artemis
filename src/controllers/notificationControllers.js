require('dotenv').config()
const helpers = require('../helpers')

exports.saveUserToken = async (req, res) => {
    console.log('request body: ', req.body)
    const { token } = req.body
    const { id: user_id } = req.body.decoded.id
    const status = 1

    try {
        const userTokens = req.sql.query(
            helpers.query.insertQuery(
                { user_id, token, status }, 'user_tokens'
            ), [user_id, token, status]
        )
        return helpers.response(res, 200, 'Token Inserted.', false, userTokens)
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})
    }
}

exports.sendNotification = async (req, res) => {
    console.log('request body: ', req.body)
    console.log('request query params: ', req.query)

    try {
        let msg = req.body.message ? req.body.message : 'Ini message testing default kalau gak dikasih params message'
        if (req.query.token) {
            console.log('Send message with token')
            const message = {
                notification: {
                    title: 'ini title',
                    body: 'ini body plus message -> ' + msg
                },
                data: {
                    foo: 'bar',
                    ndasmu: 'sakarepmu'
                },
            }
            const options = {
                priority: 'high'
            }
            console.log(req.query.token, message, options)

            try {
                const responsePushNotification = await helpers.notification.sendPushNotification(req.query.token, message, options)
                return helpers.response(res, 200, 'Message sent.', false, responsePushNotification)
            } catch (err) {
                console.log('Push Notification error')
                return helpers.response(res, 400, 'Send push notification error.', true, { err: JSON.stringify(err) })
            }
        } else {
            console.log('Send message without token')
            // const message = {
            //     notification: {
            //         title: 'ini title',
            //         body: 'ini body plus message -> ' + msg
            //     },
            //     data: {
            //         foo: 'bar',
            //         ndasmu: 'sakarepmu'
            //     },
            //     options: {
            //         priority: 'high'
            //     }
            // }
            // console.log(message)
            // return firebaseAdmin.messaging().send(message)
            //     .then((response) => {
            //         console.log('Response: ', response)
            //         return helpers.response(res, 200, 'message sent.', false, {})
            //     })
            return helpers.response(res, 422, 'Tokenya butuh bos.', false, {})
        }
    } catch (err) {
        console.error(err)
        return helpers.response(res, 500, 'Internal server error.', true, {})        
    }
}