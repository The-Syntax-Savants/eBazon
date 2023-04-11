import AWS from "aws-sdk";

const IDENTITY_POOL_ID = "us-east-1:71d2ff86-b029-4567-8d5b-51d797f61400";
const REGION = "us-east-1";

// Configure the AWS SDK with Cognito identity credentials
AWS.config.update({
  region: REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID,
  }),
});

const s3 = new AWS.S3();

export default s3;
