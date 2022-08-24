import express from 'express';
import multer from 'multer';
import { category_vendor, category_vendor_by_id } from '../controller/categoryController.js';
import { checkAuth } from '../middleware/check-auth.js';
import multerS3 from 'multer-s3'
import { MulterThree } from '../middleware/aws-upload.js';

const categoryRoute = express.Router()

var upload = multer({
    storage: multerS3(MulterThree)
})

categoryRoute.post('/', checkAuth, upload.single('category_img'), category_vendor)
categoryRoute.get('/', checkAuth, category_vendor_by_id)

export default categoryRoute