import crypto from 'crypto';
import { promisify } from 'util'
import { s3Client } from '../middleware/s3-client.js';
import multerS3 from 'multer-s3'

// Create service client module using ES6 syntax.
const randomBytes = promisify(crypto.randomBytes)
const rawBytes = randomBytes(16)
const imageName = rawBytes.toString('hex')

const MulterThree = {
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET,
    Key: imageName.toString(),
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
        cb(null, imageName.toString());
    },
}

export { MulterThree };