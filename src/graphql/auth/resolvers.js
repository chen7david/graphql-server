const { User } = require('../../models')
const JWT = require('jsonwebtoken')
const { validate, schema } = require('../../helpers/validation')
const { JWT_SECRET, JWT_DURATION, JWT_REFRESH_SECRET, JWT_REFRESH_DURATION } = require('./../../config')

const resolvers = {
    Mutation: {
        // Mutations go here ...
        
        authenticate: async (parent, args) => {
            const { username, password } = args.authInfo
            const user = await User.query().where('username', username).first()
            if(!user) throw new Error('invalid username password combination')
            if(! await user.verifyPassword(password)) throw new Error('invalid username password combination')
            if(user.disabled) throw new Error('your account is disabled, please contact us to enable your account')
    
            const payload = {
                userId: user.userId
            }
            const accessToken = JWT.sign(payload, JWT_SECRET, {expiresIn: JWT_DURATION})
            const refreshToken = JWT.sign(payload, JWT_REFRESH_SECRET, {expiresIn: JWT_REFRESH_DURATION})
    
            return {
                accessToken,
                refreshToken,
                me: user
            }
        },
    }
}

module.exports = {
    resolvers
}