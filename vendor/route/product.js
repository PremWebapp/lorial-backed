import express from 'express';
import multer from 'multer';
import { add_product } from '../controller/addproductController.js';
import util from 'util'
import connection from '../../utils/db_connection.js'

const productRoute = express.Router()

//for category iamge upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'vendor/productImage/')
    },
    filename: function (req, file, cb) {
        const query = util.promisify(connection.query).bind(connection);

        const ifExist =  query(`SELECT * FROM vendor_category WHERE vendor_id='${req.body.vendor_id}'`)
        var productImage = Object.values(JSON.parse(JSON.stringify(ifExist)))
        if (productImage?.length == 0) return res.status(400).send({ message: `Product not found!` })

        cb(null, req.body.vendor_id + '-' + req.body.category_id + '-' + productImage[0].id + '-' + Date.now() + path.extname(file.originalname));

        let xyz = query(`INSERT INTO vendor_product_img (product_id, product_img) VALUES ("${productImage[0].id}")`);

    }
})

const upload = multer({ storage: storage })

productRoute.post('/', add_product, upload.array('multi-files'))

export default productRoute