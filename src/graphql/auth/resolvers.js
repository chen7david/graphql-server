const { User } = require('../../models')
const { validate, schema } = require('../../helpers/validation')
const { sign, verify } = require('./../../helpers/jwt')

const resolvers = {
    Mutation: {
        // Mutations go here ...
        
        authenticate: async (_, args) => {
            const { username, password } = args.authInfo
            const user = await User.query().where('username', username).first()
            if(!user) throw new Error('invalid username password combination')
            if(! await user.verifyPassword(password)) throw new Error('invalid username password combination')
            if(user.disabled) throw new Error('your account is disabled, please contact us to enable your account')
    
            return {
                accessToken: sign.accessToken(user),
                refreshToken: sign.refreshToken(user),
                me: user
            }
        },

        activateAccount: async (_, args) => {
            const token = args.token
            const { userId } = verify.activationToken(token)
            const user = await User.query().where('userId', userId).first()
            if(!user) throw new Error('invalid userId')
            if(user.disabled) throw new Error('your account is disabled, please contact us to enable your account')
            
            if(!user.emailVerified){
                await user.$query().patch({emailVerified: true}) 
            }else{
                throw new Error('this account is already activated')
            }

            return {
                accessToken: sign.accessToken(user),
                refreshToken: sign.refreshToken(user),
                me: user
            }
        },

    }
}

module.exports = {
    resolvers
}