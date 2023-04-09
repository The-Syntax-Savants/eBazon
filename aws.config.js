import AWS from "aws-sdk";

AWS.config.update({
  // accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  // secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  accessKeyId: "AKIAQ2B544PDPKHJJP67",
  secretAccessKey: "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",
  region: "us-east-1",
});

const s3 = new AWS.S3();

export default s3;
