import 'dotenv/config'
import app from './app.js'

const PORT = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send('welcome')
})

app.listen(PORT, () => {
    console.log(`server listening on ${PORT} :)`)
})