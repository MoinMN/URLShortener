import json
import boto3
import time

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UrlShortener')

def lambda_handler(event, context):

    for record in event['Records']:

        body = json.loads(record['body'])

        expiry_time = int(time.time()) + (
            int(body['expiryMinutes']) * 60
        )

        table.put_item(
            Item={
                "shortCode": body["shortCode"],
                "longUrl": body["longUrl"],
                "expiryTime": expiry_time,
                "createdAt": body["createdAt"]
            }
        )

    return {
        "statusCode": 200,
        "body": json.dumps("Processed")
    }