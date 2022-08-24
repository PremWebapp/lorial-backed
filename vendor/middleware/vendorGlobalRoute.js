import express from "express";
import { checkAuth } from "./check-auth.js";
import authRoute from "../route/auth.js";
import categoryRoute from "../route/category.js";
import productRoute from "../route/product.js";

const vendorRoute = express();

vendorRoute.use('/auth', authRoute)
vendorRoute.use('/category', categoryRoute)
vendorRoute.use('/product', checkAuth, productRoute)

export default vendorRoute