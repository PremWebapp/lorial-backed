import util from 'util'
import connection from '../../utils/db_connection.js'

export const category_vendor = async (req, res, next) => {
    try {
        const { vendor_id, category_name } = req.body
        if (!(vendor_id && category_name)) return res.status(400).send({ error: "All input is required" })

        const query = util.promisify(connection.query).bind(connection);

        const ifExist = await query(`SELECT * FROM vendor_category WHERE vendor_id='${vendor_id}' AND category_name ='${category_name}'`)

        var resultCategory = Object.values(JSON.parse(JSON.stringify(ifExist)))
        if (resultCategory?.length != 0) return res.status(400).send({ message: `category Name:${category_name} all readey present with vendor_id ${vendor_id}` })

        await query(`INSERT INTO vendor_category (vendor_id, category_name, category_img) VALUES ("${vendor_id}", "${category_name}", "${req.file.path}")`);
        res.status(200).send({ message: "Data submitted successfully" });
    }
    catch (err) {
        res.status(400).send(error);
    }
}