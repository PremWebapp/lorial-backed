import express from "express";
import adminAuthRoute from "./adminAuth.js";
import adminProductRoute from "./adminProduct.js";
import adminVendorRoute from "./adminVendor.js";

const adminGlobalRoute = express();

adminGlobalRoute.use('/auth', adminAuthRoute)
adminGlobalRoute.use('/product', adminProductRoute)
adminGlobalRoute.use('/vendor', adminVendorRoute)

export default adminGlobalRoute