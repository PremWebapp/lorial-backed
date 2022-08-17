import express from "express";
import 'dotenv/config'
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from "body-parser"
import './utils/db_connection.js'
import vendorRoute from "./vendor/route/vendorGlobalRoute.js";

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/uploads',express.static('uploads'))
app.use(morgan('dev'))

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

//  route for vendor
app.use('/', vendorRoute)


app.use("*", (req, res, next) => {
    const error = {
      status: 404,
      message: API_ENDPOINT_NOT_FOUND,
    };
    next(error);
  });
  
  // global error handling middleware
  app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message
    const data = err.data || null;
    res.status(status).json({
      type: "error",
      message,
      data,
      status
    });
  });

export default app