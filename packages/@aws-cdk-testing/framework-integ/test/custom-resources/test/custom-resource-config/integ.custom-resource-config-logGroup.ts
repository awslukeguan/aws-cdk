import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { CustomResourceConfig } from 'aws-cdk-lib/custom-resources';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyStack');
const locallySetLogRetentionDays = logs.RetentionDays.ONE_WEEK;

let websiteBucket = new s3.Bucket(stack, 'WebsiteBucket', {});

new s3deploy.BucketDeployment(stack, 's3deployNone', {
  sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
  destinationBucket: websiteBucket,
  logGroup: new logs.LogGroup(stack, 'LogGroup', {
    retention: locallySetLogRetentionDays,
  }),
});

const logRetentionDays = logs.RetentionDays.TEN_YEARS;
CustomResourceConfig.of(app).addLogRetentionLifetime(logRetentionDays);

new integ.IntegTest(app, 'integ-test-custom-resource-config-logGroup', {
  testCases: [stack],
  diffAssets: false,
});
