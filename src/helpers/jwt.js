const JWT = require('jsonwebtoken')
const { User } = require('./../models')
const { 
    JWT_SECRET,
    JWT_DURATION,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_DURATION,
    JWT_ACTIVATE_ACCOUNT_SECRET, 
    JWT_ACTIVATE_ACCOUNT_DURATION,
    PASSWORD_RESET_SECRET,
    PASSWORD_RESET_DURATION,
} = require('./../config')

errors = ['invalid signature', 'jwt expired', 'invalid token', 'jwt malformed']

const getUser = async (token) => {
    const { userId } = JWT.decode(token)
    if(!userId) return false
    const user = await User.query().where('userId', userId).first()
    if(!user) throw new Error('invalid token')
    return user
}

module.exports = {

    sign:{
        accessToken: (user) => JWT.sign({
            userId: user.userId
        }, JWT_SECRET + user.password, {expiresIn: JWT_DURATION}),
    
        refreshToken: (user) => JWT.sign({
            userId: user.userId
        }, JWT_REFRESH_SECRET + user.password, {expiresIn: JWT_REFRESH_DURATION}),

        activateToken: (user) => JWT.sign({
            userId: user.userId
        }, JWT_ACTIVATE_ACCOUNT_SECRET + user.password, {expiresIn: JWT_ACTIVATE_ACCOUNT_DURATION}),

        passwordResetToken: (user) => JWT.sign({
            userId: user.userId
        }, PASSWORD_RESET_SECRET + user.password, {expiresIn: PASSWORD_RESET_DURATION}),
    },

    verify:{

        accessToken: async (token) => {
            try{
                const user = await getUser(token)
                JWT.verify(token, JWT_SECRET + user.password)
                return user
            }catch(error){
                if(errors.includes(error.message)){
                    throw new Error('activation token expired')
                }
            }
        },


        refreshToken: async (token) => {
            try{
                const user = await getUser(token)
                JWT.verify(token, JWT_REFRESH_SECRET + user.password)
                return user
            }catch(error){
                if(errors.includes(error.message)){
                    throw new Error('activation token expired')
                }
            }
        },

        activationToken: async (token) => {
            try{
                const user = await getUser(token)
                JWT.verify(token, JWT_ACTIVATE_ACCOUNT_SECRET + user.password)
                return user
            }catch(error){
                if(errors.includes(error.message)){
                    throw new Error('activation token expired')
                }
            }
        },

        passwordResetToken: async (token) => {
            try{
                const user = await getUser(token)
                JWT.verify(token, PASSWORD_RESET_SECRET + user.password)
                return user
            }catch(error){
                if(errors.includes(error.message)){
                    throw new Error('password reset token expired')
                }
            }
        },
    }
         
}