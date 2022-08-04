import util from 'util'
import connection from '../../utils/db_connection.js'

export const add_product = async (req, res, next) => {
    try {
        const { vendor_id, category_id, title, description, price, is_recomended, rating } = req.body
        if (!(vendor_id && category_id && title && description && price && is_recomended && rating)) return res.status(400).send({ error: "All input is required" })

        const query = util.promisify(connection.query).bind(connection);

        const ifExist = await query(`SELECT * FROM vendor_product WHERE vendor_id='${vendor_id}'`)

        var resultCategory = Object.values(JSON.parse(JSON.stringify(ifExist)))
        if (resultCategory && resultCategory?.length != 0 && resultCategory[0].title == title) return res.status(400).send({ message: `title Name:${title} all readey present with category_id: ${category_id}, vendor id:${vendor_id}` })

        await query(`INSERT INTO vendor_product (vendor_id, category_id, title, description, price, is_recomended, rating) VALUES ("${vendor_id}", "${category_id}", "${title}", "${description}", "${price}", "${is_recomended}", "${rating}")`);
        next()
        res.status(200).send({ message: "Data submitted successfully" });
    }
    catch (err) {
        res.status(400).send(error);
    }
}