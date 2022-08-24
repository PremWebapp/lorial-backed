import express from "express";
import 'dotenv/config'
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from "body-parser"
import './utils/db_connection.js'
import vendorRoute from "./vendor/middleware/vendorGlobalRoute.js";
import path from 'path'
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))

app.use(express.static(path.join(__dirname, 'public')));

// app.use('/images', express.static('public'));// you can access image using this url: http://localhost:7000/images/abc.jpg

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


// for AWS account routes


// api end point handeling
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