import util from 'util'
import connection from '../../utils/db_connection.js'

export const category_vendor = async (req, res, next) => {
    try {
        const { vendor_id, category_name } = req.body

        if (!(vendor_id && category_name)) return res.status(400).send({ error: "All input is required", status: 400 })

        const query = util.promisify(connection.query).bind(connection);
        const ifVendorExist = await query(`SELECT * FROM registervendor WHERE vendor_id='${vendor_id}'`)

        var resultVendor = Object.values(JSON.parse(JSON.stringify(ifVendorExist)))

        if (resultVendor?.length == 0) return res.status(400).send({ error: `vendor not found, please register first!`, status: 400 })

        const ifExist = await query(`SELECT * FROM vendor_category WHERE vendor_id='${vendor_id}' AND category_name ='${category_name}'`)

        var resultCategory = Object.values(JSON.parse(JSON.stringify(ifExist)))
        if (resultCategory?.length != 0) return res.status(400).send({ error: `Category Name:${category_name} all readey present with vendor id`, status: 400 })

        await query(`INSERT INTO vendor_category (vendor_id, category_name, category_img) VALUES ("${vendor_id}", "${category_name}", "${req.file.location}")`);
        res.status(200).send({ message: "Data submitted successfully", status: 200 });
        return next()
    }
    catch (error) {
        res.status(400).send({ error, status: 400 });
    }
}

export const category_vendor_by_id = async (req, res, next) => {
    try {
        const { vendor_id } = req.query
        if (!(vendor_id)) return res.status(400).send({ error: "All input is required", status: 400 })
        const query = util.promisify(connection.query).bind(connection);
        const ifVendorExist = await query(`SELECT * FROM vendor_category WHERE vendor_id=${vendor_id}`)
        var resultVendor = Object.values(JSON.parse(JSON.stringify(ifVendorExist)))
        return res.status(200).send({ message: "Data fetched.. successfully", status: 200, data: resultVendor });
    }
    catch (error) {
        res.status(400).send({ error, status: 400 });
    }
}