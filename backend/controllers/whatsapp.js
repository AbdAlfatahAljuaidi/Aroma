
require('dotenv').config()
const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);

exports.sendWhatsapp = async (req, res) => {

    try{
           client.messages
        .create({
                    from: 'whatsapp:+14155238886',
            contentSid: process.env.CONTENTSID,
            contentVariables: '{"1":"12/1","2":"3pm"}',
            to: 'whatsapp:+962782407533'
        })
        .then(message => console.log(message.sid))
        .done();
    }catch(error){
        console.log(error);
    }


}