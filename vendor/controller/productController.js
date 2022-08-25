import util from 'util'
import vendor_db_connection from '../../utils/vendor_db_connection.js'
import { awsRemove } from '../middleware/aws-remove.js'

export const add_product = async (req, res, next) => {
    try {
        const { vendor_id, category_id, title, description, price, is_recomended } = req.body

        if (!(vendor_id && category_id && title && description && price && is_recomended)) {
            // awsRemove(req, res, next)
            res.status(400).send({ status: 400, error: "All input is required" })
        }

        const query = util.promisify(vendor_db_connection.query).bind(vendor_db_connection);

        const ifExist = await query(`SELECT * FROM vendor_product WHERE vendor_id='${vendor_id}' AND title='${title}'`)

        var resultCategory = Object.values(JSON.parse(JSON.stringify(ifExist)))

        if (resultCategory && resultCategory?.length != 0 && resultCategory[0]?.title == title) {
            // awsRemove(req, res, next)
            res.status(400).send({ status: 400, error: `title Name:${title} all readey present with category_id: ${category_id}` })
        }

        const productSavedData = await query(`INSERT INTO vendor_product (vendor_id, category_id, title, description, price, is_recomended) VALUES ("${vendor_id}", "${category_id}", "${title}", "${description}", "${price}", "${is_recomended}")`);

        req.files.map(img => {
            query(`INSERT INTO vendor_product_img (vendor_id, product_id, vendor_product_img) VALUES ("${vendor_id}", "${productSavedData?.insertId}", "${img.location}")`);
        })
        return res.status(200).send({ status: 200, message: "Data submitted successfully" });
    }
    catch (error) {
        // awsRemove(req, res, next)
        res.status(400).send({ error, status: 400 });
    }
}

export const get_product = async (req, res, next) => {
    try {
        const { vendor_id } = req.query
        const query = util.promisify(vendor_db_connection.query).bind(vendor_db_connection);
        const ifExist = await query(`SELECT * FROM vendor_product vp  JOIN vendor_category vc ON (vp.vendor_id='${vendor_id}' AND vc.vendor_id='${vendor_id}' AND vp.category_id = vc.id )`)
        var resultCategory = Object.values(JSON.parse(JSON.stringify(ifExist)))

        return res.status(200).send({ status: 200, message: "Data fetched successfully", data: resultCategory });
    }
    catch (error) {
        res.status(400).send({ error, status: 400 });
    }
}
// DELETE FROM `vendor_product` WHERE product_id=18;
export const remove_product = async (req, res, next) => {
    try {
        const { product_id } = req.query

        const query = util.promisify(vendor_db_connection.query).bind(vendor_db_connection);

        await query(`DELETE FROM vendor_product_img WHERE product_id=${product_id}`)
        await query(`DELETE FROM vendor_product WHERE product_id=${product_id}`)

        return res.status(200).send({ status: 200, message: "Data deleted successfully", data: resultCategory });
    }
    catch (error) {
        res.status(400).send({ error, status: 400 });
    }
}

export const get_byid_product = async (req, res, next) => {
    try {
        const { product_id } = req.query

        const query = util.promisify(vendor_db_connection.query).bind(vendor_db_connection);

        const ifImgExist = await query(`SELECT * FROM  vendor_product_img WHERE product_id='${product_id}'`)
        const ifPrtoductExist = await query(`SELECT * FROM vendor_product WHERE product_id='${product_id}'`)

        var resultImg = Object.values(JSON.parse(JSON.stringify(ifImgExist)))
        var resultPrtoduct = Object.values(JSON.parse(JSON.stringify(ifPrtoductExist)))
        resultPrtoduct[0].imgPath = resultImg
        return res.status(200).send({ status: 200, message: "Data deleted successfully", data: resultPrtoduct[0] });
    }
    catch (error) {
        res.status(400).send({ error, status: 400 });
    }
}