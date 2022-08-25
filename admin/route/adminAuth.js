import express from "express";
import { admin_login } from "../controller/adminAuthController.js";

const adminAuthRoute = express.Router();

adminAuthRoute.post('/', admin_login)


export default adminAuthRoute