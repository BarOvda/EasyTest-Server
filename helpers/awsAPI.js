const fs = require('fs');
const awsConstants = require('../constants/aws-constants.json')
const AWS = require('aws-sdk');
const ID = awsConstants.ACCESS_KEY_ID;
const SECRET = awsConstants.SECRET_ACCESS_KEY_ID;
const bucketName = awsConstants.BUCKET_NAME;


exports.deleteFile = (title, folder) => {

    // Initializing S3 Interface
    const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET
    });
    const params = {
        Bucket: bucketName,
        Key:`${folder}/${title}`, // file name you want to save as
    }
    s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack);  // error
        else console.log();                 // deleted
    });
}
exports.uploadFile = (file, folder) => {

    const ContentTypes = {
        'ico': 'image/x-icon',
        'html': 'text/html',
        'js': 'application/javascript',
        'json': 'text/json',
        'css': 'text/css',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'wav': 'audio/wav',
        'mp3': 'audio/mp3',
        'svg': 'image/svg+xml',
        'pdf': 'application/pdf',
        'doc': 'application/doc'
    }


    // Initializing S3 Interface
    const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET
    });

    const extention = file.filename.split('.')[1];
    const name_without_ext = file.filename.split('.')[0];
    // read content from the file
    const fileContent = fs.readFileSync(file.path);

    // setting up s3 upload parameters
    const params = {
        Bucket: bucketName,
        Key: `${folder}/${name_without_ext}`, // file name you want to save as
        Body: fileContent,
        ContentType: ContentTypes[extention],
        //ContentDisposition : `inline; filename=${folder}/${file.filename}`
        ACL: 'public-read'


    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
        if (err) {
            throw err
        }
        console.log(`File uploaded successfully. ${data.Location}`)

    });
};
