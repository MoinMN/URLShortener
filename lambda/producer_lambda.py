import json
import boto3
import uuid
import time

sqs = boto3.client('sqs')

QUEUE_URL = "https://sqs.ap-south-1.amazonaws.com/918792379419/url-shortener-queue"

def lambda_handler(event, context):

    body = json.loads(event['body'])

    long_url = body['longUrl']
    expiry_minutes = body['expiryMinutes']

    short_code = str(uuid.uuid4())[:6]

    message = {
        "shortCode": short_code,
        "longUrl": long_url,
        "expiryMinutes": expiry_minutes,
        "createdAt": str(time.time())
    }

    sqs.send_message(
        QueueUrl=QUEUE_URL,
        MessageBody=json.dumps(message)
    )

    return {
        "statusCode": 200,
        "body": json.dumps({
            "shortUrl": "https://bit.moinnaik.in/" + short_code
        })
    }