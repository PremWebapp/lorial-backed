import express from 'express';
import multer from 'multer';
import { add_product } from '../controller/addproductController.js';
import { checkAuth } from '../middleware/check-auth.js';

const productRoute = express.Router()

//for category iamge upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'vendor/vendorProduct/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + req.body?.vendor_id + '-' + req.body?.category_id + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

productRoute.post('/', checkAuth, upload.array('images'), add_product)

export default productRoute