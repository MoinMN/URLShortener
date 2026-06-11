import json
import boto3
import uuid
import time

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UrlShortener')

def lambda_handler(event, context):

    body = json.loads(event['body'])
    long_url = body['longUrl']

    # 1️⃣ CHECK IF EXISTS
    response = table.query(
        IndexName="longUrl-index",
        KeyConditionExpression=boto3.dynamodb.conditions.Key('longUrl').eq(long_url)
    )

    if response['Items']:
        existing = response['Items'][0]
        return {
            "statusCode": 200,
            "body": json.dumps({
                "shortUrl": "https://bit.moinnaik.in/" + existing['shortCode'],
                "message": "Already exists"
            })
        }

    # 2️⃣ CREATE NEW
    short_code = str(uuid.uuid4())[:6]

    table.put_item(
        Item={
            'shortCode': short_code,
            'longUrl': long_url,
            'createdAt': str(time.time())
        }
    )

    return {
        "statusCode": 200,
        "body": json.dumps({
            "shortUrl": "https://bit.moinnaik.in/" + short_code
        })
    }