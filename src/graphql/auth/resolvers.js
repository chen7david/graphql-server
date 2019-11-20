const { User } = require('../../models')
const JWT = require('jsonwebtoken')
const { validate, schema } = require('../../helpers/validation')
const { 
    JWT_SECRET,
     JWT_DURATION,
     JWT_REFRESH_SECRET,
     JWT_REFRESH_DURATION,
     JWT_ACTIVATE_ACCOUNT_SECRET
 } = require('./../../config')

const resolvers = {
    Mutation: {
        // Mutations go here ...
        
        authenticate: async (_, args) => {
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
        activateAccount: async (_, args) => {
            try{
                const token = args.token
                const { userId } = JWT.verify(token, JWT_ACTIVATE_ACCOUNT_SECRET)
                const user = await User.query().where('userId', userId)
                if(!user) throw new Error('invalid userId')
                if(user.disabled) throw new Error('your account is disabled, please contact us to enable your account')
                if(!user.emailVerified){
                   await user.$query().patch({emailVerified: true}) 
                }else{
                    throw new Error('this account is already activated')
                }

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

            }catch(error){ 
                errors = ['invalid signature', 'jwt expired', 'invalid token', 'jwt malformed']
                if(errors.includes(error.message) ){
                    throw new Error('activation token expired')
                }
            }
        },

    }
}

module.exports = {
    resolvers
}