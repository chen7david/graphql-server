const Joi = require('@hapi/joi')

module.exports = {
    validate: (schema, data) => {
        const validate = schema.validate(data)
        if(validate.error){
        
            const { error:{ details } } = validate
            const messages = {}
            
            for(const detail of details) {
                const { context, message } = detail
                messages[context.key] = message
            }
            console.log(messages)
            throw new Error(JSON.stringify(messages))
        }else{
            return validate.value
        }        

    },

    schema: {
        addUser: Joi.object().options({abortEarly:false}).keys({
            username: Joi.string().min(5),
            email: Joi.string().min(5),
            password: Joi.string().min(5),
        })
    }
}
