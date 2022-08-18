import express from "express";
import { checkAuth } from "../middleware/check-auth.js";
import authRoute from "./auth.js";
import categoryRoute from "./category.js";
import productRoute from "./product.js";

const vendorRoute = express();

vendorRoute.use('/auth', authRoute)
vendorRoute.use('/category', categoryRoute)
vendorRoute.use('/product', checkAuth, productRoute)

export default vendorRoute