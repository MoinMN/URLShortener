import json
import boto3
import uuid
import time
from boto3.dynamodb.conditions import Key

sqs = boto3.client('sqs')

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UrlShortener')

QUEUE_URL = "https://sqs.ap-south-1.amazonaws.com/918792379419/url-shortener-queue"

def lambda_handler(event, context):

    try:
        body = json.loads(event['body'])

        long_url = body['longUrl']
        expiry_minutes = int(body['expiryMinutes'])

        if expiry_minutes <= 0:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "message": "expiryMinutes must be greater than 0"
                })
            }

        expiry_time = int(time.time()) + (expiry_minutes * 60)

        # Check if URL already exists
        response = table.query(
            IndexName="longUrl-index",
            KeyConditionExpression=Key('longUrl').eq(long_url)
        )

        if response['Items']:

            existing = response['Items'][0]

            table.update_item(
                Key={
                    "shortCode": existing["shortCode"]
                },
                UpdateExpression="SET expiryTime = :e",
                ExpressionAttributeValues={
                    ":e": expiry_time
                }
            )

            return {
                "statusCode": 200,
                "body": json.dumps({
                    "shortUrl": f"https://bit.moinnaik.in/{existing['shortCode']}",
                    "message": "Existing URL updated"
                })
            }

        # New URL
        short_code = str(uuid.uuid4())[:6]

        sqs.send_message(
            QueueUrl=QUEUE_URL,
            MessageBody=json.dumps({
                "shortCode": short_code,
                "longUrl": long_url,
                "expiryMinutes": expiry_minutes,
                "createdAt": str(time.time())
            })
        )

        return {
            "statusCode": 200,
            "body": json.dumps({
                "shortUrl": f"https://bit.moinnaik.in/{short_code}",
                "message": "New URL created"
            })
        }

    except Exception as e:
        print(str(e))

        return {
            "statusCode": 500,
            "body": json.dumps({
                "message": "Internal server error"
            })
        }