import util from 'util'
import connection from '../../utils/db_connection.js'

export const add_product = async (req, res, next) => {
    try {
        const { vendor_id, category_id, title, description, price, is_recomended } = req.body

        if (!(vendor_id && category_id && title && description && price && is_recomended)) return res.status(400).send({ status: 400, error: "All input is required" })

        const query = util.promisify(connection.query).bind(connection);

        const ifExist = await query(`SELECT * FROM vendor_product WHERE vendor_id='${vendor_id}' AND title='${title}'`)

        var resultCategory = Object.values(JSON.parse(JSON.stringify(ifExist)))

        if (resultCategory && resultCategory?.length != 0 && resultCategory[0]?.title == title) return res.status(400).send({ status: 400, error: `title Name:${title} all readey present with category_id: ${category_id}` })

        await query(`INSERT INTO vendor_product (vendor_id, category_id, title, description, price, is_recomended) VALUES ("${vendor_id}", "${category_id}", "${title}", "${description}", "${price}", "${is_recomended}")`);
        return res.status(200).send({ status: 200, message: "Data submitted successfully" });
    }
    catch (error) {
        res.status(400).send({ error, status: 400 });
    }
}

export const get_product = async (req, res, next) => {
    try {
        const { vendor_id } = req.query
        const query = util.promisify(connection.query).bind(connection);
        const ifExist = await query(`SELECT * FROM vendor_product u JOIN vendor_category ud ON (u.vendor_id='${vendor_id}') `)
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

        const query = util.promisify(connection.query).bind(connection);
        const ifExist = await query(`DELETE FROM vendor_product WHERE product_id="${product_id}" `)

        var resultCategory = Object.values(JSON.parse(JSON.stringify(ifExist)))

        return res.status(200).send({ status: 200, message: "Data deleted successfully", data: resultCategory });
    }
    catch (error) {
        res.status(400).send({ error, status: 400 });
    }
}