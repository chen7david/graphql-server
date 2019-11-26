module.exports = {
    BASE_URL: 'http://localhost:5000/',
    PORT: 4000,
    JWT_SECRET: 'secret',
    JWT_DURATION: '1d',
    JWT_REFRESH_SECRET: 'refresh-secret',
    JWT_REFRESH_DURATION: '31d',
    JWT_ACTIVATE_ACCOUNT_SECRET: 'refresh-secret',
    JWT_ACTIVATE_ACCOUNT_DURATION: '7d',

    EMAIL_SERVICE: 'gmail',
    EMAIL_SENDER:'@gmail.com',
    GMAIL_ACCOUNT:'@gmail.com',
    GMAIL_PASSWORD:'',

    PASSWORD_RESET_SECRET: 'password-reset',
    PASSWORD_RESET_DURATION: '30m'
}