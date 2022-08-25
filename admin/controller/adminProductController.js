import vendor_db_connection from '../../utils/vendor_db_connection.js'
import util from 'util'

export const all_product_list = async (req, res, next) => {
    try {
        const query = util.promisify(vendor_db_connection.query).bind(vendor_db_connection);
        const ifExist = await query(`SELECT * FROM vendor_product`)
        var resultCategory = Object.values(JSON.parse(JSON.stringify(ifExist)))

        return res.status(200).json({ data: resultCategory, status: 200, message: 'all product fateched successfully' })
    } catch (error) { return res.status(400).json({ error, status: 400 }) }
}