import express from "express";
import { all_product_list } from "../controller/adminProductController.js";
import { checkAdminAuth } from "../middleware/check-admin-auth.js";

const adminProductRoute = express.Router();

adminProductRoute.get('/list', checkAdminAuth, all_product_list)

export default adminProductRoute