// const fast2sms = require('fast-two-sms')
import unirest from 'unirest'
import { validationResult } from 'express-validator'
import connection from '../../utils/db_connection.js'
import util from 'util'


export const sendOTPmessage = async (req, res, next) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) return res.status(400).send({ error });
        const otp =  Math.floor(1000 + Math.random() * 9000);

        const { mobile } = req.body;
        const query = util.promisify(connection.query).bind(connection);

        var reqUrl = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

        reqUrl.headers({
            "authorization": process.env.FAST2SMS_API_TOKEN
        });

        reqUrl.form({
            "message": `Hey User, your OTP is : ${otp} ,please do not share with anyone!`,
            "numbers": mobile,
            "route": process.env.FAST2SMS_ROUTE,
            "sender_id": process.env.FAST2SMS_SENDER_ID,
            "flash": 0,
            "language": "english",
            "variables_values": "5599",
        });

        // send this message

        const oldotp = await query(`SELECT * FROM vendorotp WHERE mobile=${mobile}`);
        var resultUser = Object.values(JSON.parse(JSON.stringify(oldotp)))

        if (resultUser.length > 0) {
            await reqUrl.end();
            // UPDATE students SET marks=84 WHERE marks=74
            await query(`UPDATE vendorotp SET otp=${otp} , active=${false} WHERE mobile=${mobile}`);

            return res.status(200).send({ message: 'OTP send succedfully' ,status:200});
        } else {
            await reqUrl.end();

            // save data in otp table
            await query(`INSERT INTO vendorotp ( mobile, otp, active) VALUES ("${mobile}","${otp}", "${false}")`);

            return res.status(200).send({ message: 'OTP send succedfully' , status:200});
        }
    }
    catch (error) {
        return res.status(400).send({ error });
    }

}
