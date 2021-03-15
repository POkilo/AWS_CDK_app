import * as cdk from '@aws-cdk/core';
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');
import s3 = require('@aws-cdk/aws-s3');
import * as path from 'path';

export class LambdaApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const lambdabucket = s3.Bucket.fromBucketAttributes(this, "code-output-bucket", {
      bucketArn: 'arn:aws:s3:::code-output-bucket'
    });

    const hiFunction1 = new lambda.Function(this, 'hiFunction1', {
      code : lambda.Code.fromAsset(path.join(__dirname, '../src/lambda1.zip')),  
      handler: 'main',
      runtime: lambda.Runtime.GO_1_X,
    });


    const hiFunction2 = new lambda.Function(this, 'hiFunction2', {
      //create asset in S3 bucket
      code : lambda.Code.fromBucket(lambdabucket, "Golang/main.zip"), 
      // code : lambda.Code.fromAsset(path.join(__dirname, '../src/lambda2.zip')),    
      handler: 'main',
      runtime: lambda.Runtime.GO_1_X,
    });
    lambdabucket.grantReadWrite(hiFunction2);

    //deploy the api gateway using only one stage => po_stage
    const restapi = new apigw.RestApi(this, "hiFuncEndpoint",{
      restApiName: 'po',
      deployOptions: {stageName:"po_stage"}
    });

    const src_greeting1 = restapi.root.addResource('greeting1');
    const src_greeting2 = restapi.root.addResource('greeting2');
    const greetingIntegration1 = LambdaApiTemplate(hiFunction1);
    const greetingIntegration2 = LambdaApiTemplate(hiFunction2);
    src_greeting1.addMethod('GET',greetingIntegration1 ,methodResponseConfig);
    src_greeting2.addMethod('GET',greetingIntegration2 ,methodResponseConfig);
  }
}

function LambdaApiTemplate(func : lambda.Function){
  return new apigw.LambdaIntegration(func,{
    proxy:false,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
    integrationResponses:[{
      statusCode: '200',
      responseTemplates: {
        "application/json": ""
      },
      //enable cors
      responseParameters: corsConfig
    }]
  });
}

let methodResponseConfig = {
  methodResponses: [{
    statusCode: '200',
    responseParameters: {
      'method.response.header.Access-Control-Allow-Headers': true,
      'method.response.header.Access-Control-Allow-Methods': true,
      'method.response.header.Access-Control-Allow-Credentials': true,
      'method.response.header.Access-Control-Allow-Origin': true,
    },  
  }]
}

let corsConfig ={
  'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
  'method.response.header.Access-Control-Allow-Origin': "'*'",
  'method.response.header.Access-Control-Allow-Credentials': "'false'",
  'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
}