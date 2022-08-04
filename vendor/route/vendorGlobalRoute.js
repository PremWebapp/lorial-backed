import express from "express";
import authRoute from "./auth.js";
import categoryRoute from "./category.js";
import productRoute from "./product.js";

const vendorRoute = express();

vendorRoute.use('/auth', authRoute)
vendorRoute.use('/category', categoryRoute)
vendorRoute.use('/add-product', productRoute )

export default vendorRoute