import multer from 'multer';
import { add_product, get_product, remove_product ,get_byid_product} from '../controller/productController.js';
import { checkAuth } from '../middleware/check-auth.js';
import express from 'express';
import multerS3 from 'multer-s3'
import { MulterThree } from '../middleware/aws-upload.js';

const productRoute = express.Router()

var upload = multer({
    storage: multerS3(MulterThree)
})

productRoute.post('/', checkAuth, upload.array('images'), add_product)
productRoute.get('/', checkAuth, get_product)
productRoute.get('/details', checkAuth, get_byid_product)
productRoute.delete('/', checkAuth, remove_product)

export default productRoute