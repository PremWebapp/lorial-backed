import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { validationResult } from 'express-validator'
import connection from '../../utils/db_connection.js'

//loging controller
export const login_by_vendor = async (req, res, next) => {
//   try {
//     const error = validationResult(req)
//     if (!error.isEmpty()) return res.status(400).send({ error });

//     // all required field check
//     const { mobile, password } = req.body;
//     if (!(mobile && password)) return res.status(400).send({ error: "All input is required" });

//     const user = await User.findOne({ mobile });
//     if (user && (await bcryptjs.compare(password, user.password))) {
//       // Create token
//       const token = jwt.sign(
//         { user_id: user._id, email },
//         process.env.TOKEN_KEY,
//       );

//       // user
//       res.status(200).json({ user, token })
//     } else res.status(400).send({ error: 'user not found please login' });

//   } catch (error) {
//     res.status(400).send({ error });
//   }
}

//register controller
export const register_by_vendor = async (req, res, next) => {
  try {
    // all required field check
    const { first_name, last_name, email, password, mobile } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name  && mobile)) return res.status(400).send({ error: "All input is required" })

    //add profile image path
    var oldUser = "SELECT email FROM registervendor WHERE email = '" + email + "'";

    const findoldUser = await connection.query(oldUser)
    console.log('findoldUser', findoldUser)
    // const oldUser = await User.findOne({ email });
    if (findoldUser) return res.status(400).send({ message: "User Already Exist. Please Login" })

    const encryptedPassword = await bcryptjs.hash(password, 10);

    var sql = await `INSERT INTO registervendor (first_name, last_name, mobile, email, password) VALUES ("${first_name}", "${last_name}", "${mobile}","${email}", "${encryptedPassword}")`;
    const submitted = await  connection.query(sql);

    res.status(200).send({ message: "Data submitted successfully", data:req.body });
  } catch (error) {
    res.status(400).json({
      error
    });
  }
}