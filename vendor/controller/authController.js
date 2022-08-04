import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { validationResult } from 'express-validator'
import connection from '../../utils/db_connection.js'
import util from 'util'

//loging controller
export const login_by_vendor = async (req, res, next) => {
  try {
    const error = validationResult(req)
    if (!error.isEmpty()) return res.status(400).send({ error });
    const query = util.promisify(connection.query).bind(connection);

    const { otp } = req.body;

    //add profile image path
    const ifExist = await query(`SELECT * FROM vendorotp WHERE otp=${otp}`);
    var resultUser = Object.values(JSON.parse(JSON.stringify(ifExist)));

    if (resultUser.length == 0) return res.status(400).send({ message: "User not found, please register!" });

    // compare OTP with existing OTP 
    if (resultUser[0]?.otp !== otp) return res.status(400).send({ message: "In Valid OTP, please send a valid OTP!" })

    if (resultUser && resultUser[0]) {
      // Create token
      const token = jwt.sign(
        { user_id: resultUser[0]?.id, 'mobile': resultUser[0]?.mobile },
        process.env.TOKEN_KEY,
      );
      await query(`UPDATE vendorotp SET active=${true} WHERE mobile=${resultUser[0]?.mobile}`);
      resultUser.active = true
      // user
      res.status(200).json({ resultUser, token })
    } else res.status(400).send({ error: 'OTP not found please login' });

  } catch (error) {
    res.status(400).send(error);
  }
}

//register controller
export const register_by_vendor = async (req, res, next) => {
  try {
    const error = validationResult(req)
    if (!error.isEmpty()) return res.status(400).send({ error });

    const query = util.promisify(connection.query).bind(connection);

    // Validate user input
    const { bank_details, pickup_location } = req.body;
    const { first_name, last_name, email, password, mobile } = req.body;
    if (!(email && password && first_name && last_name && mobile)) return res.status(400).send({ error: "All input is required for registertion" })

    // checking of vendor bank details
    const { acc_holder_name, acc_number, IFSC_code, bank_state, bank_city, bank_pincode } = bank_details;
   
    if (acc_number <= 8) return res.status(400).send({ error: "Account number must be between 8 and 20" });

    if (!(acc_holder_name && acc_number && IFSC_code && bank_state && bank_city && bank_pincode)) return res.status(400).send({ error: "All input is required of bank details" });

    // checking of vendor pickup  details
    const { address, pickup_state, pickup_city, pickup_pincode, lat, lng } = pickup_location;
    if (!(address && pickup_state && pickup_city && pickup_pincode && lat && lng)) return res.status(400).send({ error: "All input is required of vendor pickup location details" });

    const ifExist = await query(`SELECT * FROM registervendor WHERE mobile=${mobile}`);
    var oldUser = Object.values(JSON.parse(JSON.stringify(ifExist)));

    // checking all tables for-each
    if (oldUser.length != 0) {
      var check_bank = await query(`SELECT vendor_id FROM vendor_bank_details WHERE vendor_id=${oldUser[0].vendor_id}`);
      var check_location = await query(`SELECT vendor_id FROM vendor_pickup_location WHERE vendor_id=${oldUser[0].vendor_id}`);

      if (!(check_bank && check_location)) {
        await query(`DELETE FROM registervendor WHERE mobile=${mobile}`)
        await query(`DELETE FROM vendor_bank_details WHERE vendor_id=${oldUser[0].vendor_id}`)
      }
    }

    if (oldUser.length) return res.status(400).send({ message: "User Already Exist. Please Login" })

    const encryptedPassword = await bcryptjs.hash(password, 10);

    //save record for user register
    await query(`INSERT INTO registervendor (first_name, last_name, mobile, email, password, isPermitted) VALUES ("${first_name}", "${last_name}", "${mobile}","${email}", "${encryptedPassword}", "${false}")`);

    const venderSave = await query(`SELECT * FROM registervendor WHERE mobile=${mobile}`);
    var venderSaveData = Object.values(JSON.parse(JSON.stringify(venderSave)));

    //save record for bank details
    await query(`INSERT INTO vendor_bank_details (vendor_id, acc_holder_name, acc_number, IFSC_code, state, city, pincode) VALUES ("${venderSaveData[0]?.vendor_id}", "${acc_holder_name}", "${acc_number}", "${IFSC_code}","${bank_state}", "${bank_city}", "${bank_pincode}")`);

    //save record for pickup location
    await query(`INSERT INTO vendor_pickup_location (vendor_id, address,  state, city, pincode, lat, lng) VALUES ("${venderSaveData[0]?.vendor_id}", "${address}", "${pickup_state}", "${pickup_city}", "${bank_pincode}","${lat}", "${lng}")`);

    res.status(200).send({ message: "Data submitted successfully" });

  } catch (error) { res.status(400).json(error) }
}