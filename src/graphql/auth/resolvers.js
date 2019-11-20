const { User } = require('../../models')
const { validate, schema } = require('../../helpers/validation')
const { mail } = require('./../../helpers/mail')
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

        refreshToken: async (_, args) => {
            const token = args.refreshToken
            const user = await verify.activationToken(token)
            if(!user) throw new Error('invalid token')
            if(! await user.verifyPassword(password)) throw new Error('invalid token')
            if(user.disabled) throw new Error('your account is disabled, please contact us to enable your account')
    
            return {
                accessToken: sign.accessToken(user),
                me: user
            }
        },

        activateAccount: async (_, args) => {
            const token = args.token
            const user = await verify.activationToken(token)

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

        resendActivation: async (_, args) => {
            const email = args.email
            const user = await User.query().where('email', email).first()
            if(!user) throw new Error('unregistered email')
            if(user.disabled) throw new Error('your account is disabled, please contact us to enable your account')
            
            if(user.emailVerified)
                throw new Error('this account is already activated')

            await mail.sendMail({
                to:user.email,
                subject:'Activation Email',
                body: mail.template('activation', {
                    user,
                    subject:'Activation Email',
                    link: `account/activation/${sign.activateToken(user)}/activationToken`
                })
            })

            return true
        },

        sendPasswordReset: async (_, args) => {
            const email = args.email
            const user = await User.query().where('email', email).first()
            if(!user) throw new Error('unregistered email')
            if(user.disabled) throw new Error('your account is disabled, please contact us to enable your account')
            if(!user.emailVerified) throw new Error('this account is has not been activated yet')

            await mail.sendMail({
                to:user.email,
                subject:'Password Reset Email',
                body: mail.template('resetpwd', {
                    user,
                    subject:'Password Reset Email',
                    link: `password/recovery/${sign.passwordResetToken(user)}/passwordRecoveryToken`
                })
            })

            return true
        },

        resetPassword: async (_, args) => {
            const { password, passwordConfirm, token} = args.passwordRecovery
            const user = await verify.passwordResetToken(token)
            
            if(!user) throw new Error('invalid token')
            if(user.disabled) throw new Error('your account is disabled, please contact us to enable your account')
            if(!user.emailVerified) throw new Error('this account is has not been activated yet')

            await user.$query().patch({password: password})

            await mail.sendMail({
                to:user.email,
                subject:'Password Reset Email',
                body: mail.template('pwdupdated', {
                    user,
                    subject:'Password Updated Email'
                })
            })

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