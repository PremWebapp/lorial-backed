import express from "express";
import { login_by_vendor, register_by_vendor } from "../controller/authController.js";

const vendorRoutre = express.Router();

vendorRoutre.post('/login', login_by_vendor)
vendorRoutre.post('/register', register_by_vendor)

export default vendorRoutre