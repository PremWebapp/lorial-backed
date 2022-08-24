import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3-client.js";


// const deleteImgS3 = async (params) => {
//     try {
//         console.log('innnnnnnnnnnnnnnnnnnnnnnnnnn')
//         const data = await s3Client.send(new DeleteObjectCommand(params));
//         console.log("Success. Object deleted>>>>>>>>>>>>>>>>>>>>>>>>.", data);
//         return data; // For unit tests.
//     } catch (err) {
//         console.log("Error>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", err);
//     }
// }



export const awsRemove = async (files) => {

    try {
        let img = files?.map(img => {
            let keyPath = img?.location?.split('/');
            let lastElement = keyPath[keyPath.length - 1]
            return {
                Key: lastElement.toString(),
            }
        })
        console.log('img', img)
        const bucketParams = {
            Bucket: process.env.AWS_S3_BUCKET,
            Delete: {
                Objects: img
            },
        }
        const data = await s3Client.send(new DeleteObjectsCommand(bucketParams));
        console.log("Success. Object deleted.");

        return data; // For unit tests.

    } catch (err) {
        console.log("Error", err);
    }
}










  // try {

    //     console.log('file=========================================', files)
    //     files?.map(img => {
    //         let keyPath = img?.location?.split('/');
    //         let lastElement = keyPath[keyPath.length - 1]
    //         var params = {
    //             Bucket: process.env.AWS_S3_BUCKET,
    //             Key: 'de1b1c7bee55322d6def183a837bc892'
    //         };
    //         deleteImgS3(params)
    //         console.log('lastElement', lastElement)

    //     })
    // catch (error) {
    //     console.log(error)
    // }