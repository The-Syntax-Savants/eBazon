import AWS from "aws-sdk";

AWS.config.update({
  region: "us-east-1",
});

const s3 = new AWS.S3();

export default s3;
