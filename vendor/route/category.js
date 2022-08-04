import express from 'express';
import multer from 'multer';
import { category_vendor } from '../controller/categoryController.js';

const categoryRoute = express.Router()

//for category iamge upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'vendor/categoryImage/')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.vendor_id + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

categoryRoute.post('/', upload.single('category_img'), category_vendor)

export default categoryRoute