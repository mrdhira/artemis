const { firebaseConfig: serviceAccount, firebaseDBURL } = require('../../config')
const admin = require('firebase-admin')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: firebaseDBURL
})

exports.sendPushNotification = async (token, message, options) => {
    console.log('HELPERS - Send Push notification', {token, message, options})
    try {
        return admin
            .messaging()
            .sendToDevice(token, message, options)
            .then((response) => {
                console.log('Response from Send Push Notification => ', response)
                console.log('Results => ', response.results)
                return response
            })
    } catch (err) {
        throw err
    }
}