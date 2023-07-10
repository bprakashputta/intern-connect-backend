// aws-config.js
const { S3Client, ConfigServiceClient } = require("@aws-sdk/client-s3");

// Create a custom configuration object
const clientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.REGION,
};

const s3 = new S3Client({
  region: clientConfig.region,
  credentials: clientConfig.credentials,
});

const BUCKET = process.env.BUCKET;

module.exports = {
  s3,
  BUCKET,
};
