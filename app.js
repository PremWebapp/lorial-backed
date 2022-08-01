import express from "express";
import 'dotenv/config'
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from "body-parser"
import './utils/db_connection.js'
import vendorRoutre from "./vendor/route/auth.js";

const app = express();

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 400
    next() // 404 errors 
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

//  routes for vendor
app.use('/vendor', vendorRoutre)

export default app