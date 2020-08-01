const env = process.env.NODE_ENV || 'development'
const envConfig = require('./environments')[env]
const dbConfig = require('./database')

const config = {
    env,
    host: process.env.NODE_HOST || '0.0.0.0',
    port: process.env.NODE_PORT || 3000,
    envConfig,
    dbConfig,
    firebaseConfig: require('../credentials/serviceAccount.json'),
    firebaseDBURL: process.env.firebase_databaseURL,
}

module.exports = config
