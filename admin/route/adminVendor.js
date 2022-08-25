import express from "express";
import { all_vendor_list } from "../controller/adminVendorController.js";
import { checkAdminAuth } from "../middleware/check-admin-auth.js";

const adminVendorRoute = express.Router();

adminVendorRoute.get('/list', checkAdminAuth, all_vendor_list)

export default adminVendorRoute