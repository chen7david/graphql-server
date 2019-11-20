const JWT = require('jsonwebtoken')
const { 
    JWT_SECRET,
    JWT_DURATION,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_DURATION,
    JWT_ACTIVATE_ACCOUNT_SECRET, 
    JWT_ACTIVATE_ACCOUNT_DURATION
} = require('./../config')

errors = ['invalid signature', 'jwt expired', 'invalid token', 'jwt malformed']

module.exports = {

    sign:{
        accessToken: (user) => JWT.sign({
            userId: user.userId
        }, JWT_SECRET, {expiresIn: JWT_DURATION}),
    
    
        refreshToken: (user) => JWT.sign({
            userId: user.userId
        }, JWT_REFRESH_SECRET, {expiresIn: JWT_REFRESH_DURATION}),


        activateToken: (user) => JWT.sign({
            userId: user.userId
        }, JWT_ACTIVATE_ACCOUNT_SECRET, {expiresIn: JWT_ACTIVATE_ACCOUNT_DURATION}),
    },

    verify:{
        activationToken: (token) => {
            try{
                return JWT.verify(token, JWT_ACTIVATE_ACCOUNT_SECRET)
            }catch(error){
                if(errors.includes(error.message)){
                    throw new Error('activation token expired')
                }
            }
        },

        refreshToken: (token) => {
            try{
                return JWT.verify(token, JWT_REFRESH_SECRET)
            }catch(error){
                if(errors.includes(error.message)){
                    throw new Error('activation token expired')
                }
            }
        }
    }
         
}