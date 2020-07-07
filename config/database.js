module.exports = {
    DB_HOST: process.env.DB_HOST || '0.0.0.0',
    DB_PORT: process.env.DB_PORT || 5432,
    DB_USER: process.env.DB_USER || 'artemis',
    DB_PASS: process.env.DB_PASS || 'secret',
    DB_NAME: process.env.DB_NAME || 'artemis',
}
