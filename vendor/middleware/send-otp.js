import unirest from 'unirest'
import { validationResult } from 'express-validator'
import vendor_db_connection from '../../utils/vendor_db_connection.js'
import util from 'util'


export const sendOTPmessage = async (req, res, next) => {
    try {
        const { mobile } = req.body;
        const query = util.promisify(vendor_db_connection.query).bind(vendor_db_connection);

        const oldUser = await query(`SELECT * FROM registervendor WHERE mobile=${mobile}`);
        var ifExistUser = Object.values(JSON.parse(JSON.stringify(oldUser)))

        if (ifExistUser?.length === 0 || ifExistUser[0]?.mobile !== mobile) return res.status(400).send({ error: "Invalid mobile number !", status: 400 });

        if (ifExistUser?.length === 0 || ifExistUser[0]?.isPermitted === 0) return res.status(400).send({ error: "Can't able to login, pending from admin side!", status: 400 });

        const error = validationResult(req)
        if (!error.isEmpty()) return res.status(400).send({ error });
        const otp = Math.floor(1000 + Math.random() * 9000);


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

        const oldotpCheck = await query(`SELECT * FROM vendorotp WHERE mobile=${mobile}`);
        var resultUser = Object.values(JSON.parse(JSON.stringify(oldotpCheck)))


        if (resultUser.length > 0) {
            await reqUrl.end();
            // UPDATE students SET marks=84 WHERE marks=74
            await query(`UPDATE vendorotp SET otp=${otp} , active=${false} WHERE mobile=${mobile}`);

            return res.status(200).send({ message: 'OTP send succedfully', status: 200 });
        } else {
            await reqUrl.end();

            // save data in otp table
            await query(`INSERT INTO vendorotp ( mobile, otp, active) VALUES ("${mobile}","${otp}", "${false}")`);

            return res.status(200).send({ message: 'OTP send succedfully', status: 200 });
        }
    }
    catch (error) {
        return res.status(400).send({ error });
    }

}
