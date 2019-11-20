const nodemailer = require('nodemailer')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')




const { 
     EMAIL_SERVICE,
     GMAIL_ACCOUNT,
     GMAIL_PASSWORD,
     EMAIL_SENDER 
} = require('../../config')

const Mailer = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
           user: GMAIL_ACCOUNT,
           pass: GMAIL_PASSWORD
    }
})

module.exports = {

    sendMail: async (config) => {        
        try{
            await Mailer.sendMail({
                from: EMAIL_SENDER, 
                to: config.to,
                subject: config.subject,
                html: config.body
            })
            return true

        }catch(err){
            console.log(err)
            throw new Error(`Faild to send activation email to ${config.to}!`)
        }
    },

    template: (name, data = null) => {
        const template = fs.readFileSync(path.resolve(__dirname, `./template/${name}.html`), 'utf8')
        return  data != null ?  _.template(template)(data) : template
    }
}
