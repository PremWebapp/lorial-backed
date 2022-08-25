import jwt from 'jsonwebtoken'


export const admin_login = async (req, res, next) => {
    try {
        const { user_name, password } = req.body;
        if (!(user_name && password)) return res.status(400).send({ error: "All input is required for Login" })
        if (!(user_name === 'admin@123' && password === 'admin@123')) return res.status(400).send({ error: "Wrong username or password" })

        //genrate token for admin login
        const token = jwt.sign(
            { 'user_name': user_name },
            process.env.ADMIN_TOKEN_KEY,
        )
        return res.status(200).json({  token, status: 200, message: 'logged in successfully' })
    } catch (error) { return res.status(400).json({ error, status: 400 }) }
}