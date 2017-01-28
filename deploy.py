#!/usr/bin/env
"""
Deploy the Lambda function
v1.0.0
"""
from __future__ import print_function
import sys
import boto3
from botocore.exceptions import ClientError

def publish_new_version(artifact, func_name):
    """
    Publishes new version of the AWS Lambda Function
    """
    try:
        session = boto3.Session(profile_name='alexa_date_night_deploy')
        client = session.client('lambda', region_name='us-east-1')
    except ClientError as err:
        print("Failed to create boto3 client.\n" + str(err))
        return False

    try:
        response = client.update_function_code(
            FunctionName=str(func_name),
            ZipFile=open(artifact, 'rb').read(),
            Publish=False
        )
        print(response)
        return response
    except ClientError as err:
        print("Failed to update function code.\n" + str(err))
        return False
    except IOError as err:
        print("Failed to access " + artifact + ".\n" + str(err))
        return False

def main():
    " Your favorite wrapper's favorite wrapper "
    print('Starting deploy...')
    if not publish_new_version('../lambda.zip', 'AlexaDateNight'):
        print('Failed to deploy!')
        sys.exit(1)

if __name__ == "__main__":
    main()
