import json
import boto3
import time
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UrlShortener')

def lambda_handler(event, context):

    for record in event['Records']:
        body = json.loads(record['body'])

        short_code = body['shortCode']
        long_url = body['longUrl']
        expiry_minutes = int(body['expiryMinutes'])

        expiry_time = int(time.time()) + (expiry_minutes * 60)

        # CHECK IF longUrl EXISTS
        response = table.query(
            IndexName="longUrl-index",
            KeyConditionExpression=Key('longUrl').eq(long_url)
        )

        # IF EXISTS → UPDATE EXPIRY ONLY
        if response['Items']:

            existing_item = response['Items'][0]

            table.update_item(
                Key={
                    "shortCode": existing_item["shortCode"]
                },
                UpdateExpression="SET expiryTime = :e",
                ExpressionAttributeValues={
                    ":e": expiry_time
                }
            )

        # IF NOT EXISTS → INSERT NEW
        else:
            table.put_item(
                Item={
                    "shortCode": short_code,
                    "longUrl": long_url,
                    "expiryTime": expiry_time,
                    "createdAt": body['createdAt']
                }
            )

    return {
        "statusCode": 200,
        "body": json.dumps("Processed")
    }