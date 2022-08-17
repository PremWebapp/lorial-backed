import express from 'express';
import multer from 'multer';
import { category_vendor, category_vendor_by_id } from '../controller/categoryController.js';
import { checkAuth } from '../middleware/check-auth.js';

const categoryRoute = express.Router()

//for category iamge upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('req.body.vendor_id>>================================', req.body)
        cb(null, 'vendor/vendorCategoryImage/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname+ '-' + uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

categoryRoute.post('/',checkAuth, upload.single('category_img'), category_vendor)
categoryRoute.get('/',checkAuth, category_vendor_by_id)

export default categoryRoute