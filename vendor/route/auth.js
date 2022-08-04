import express from "express";
import { login_by_vendor, register_by_vendor } from "../controller/authController.js";
import { sendOTPmessage } from "../middleware/send-otp.js";
import { check, body } from 'express-validator'

const authRoute = express.Router();

authRoute.post('/',[body('mobile').isLength({ min: 10 }).withMessage('mobile number must be 10 digits')], sendOTPmessage)

authRoute.post('/login', [body('otp').isLength({ max: 6, min: 6 }).withMessage('OTP must be 6 digit')], login_by_vendor)

authRoute.post('/register', [body('mobile').isLength({ min: 10 }).withMessage('mobile number must be 10 digits'), body('password').isLength({ min: 5 }).withMessage('password must be at least 5 characters')], register_by_vendor)

export default authRoute