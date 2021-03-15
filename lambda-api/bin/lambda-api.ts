#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaApiStack } from '../lib/lambda-api-stack';

const app = new cdk.App();
new LambdaApiStack(app, 'LambdaApiStack');
