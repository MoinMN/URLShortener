import json
import boto3
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UrlShortener')

def lambda_handler(event, context):

    for record in event['Records']:
        body = json.loads(record['body'])

        short_code = body['shortCode']
        long_url = body['longUrl']

        table.put_item(
            Item={
                'shortCode': short_code,
                'longUrl': long_url,
                'createdAt': str(datetime.utcnow())
            }
        )

    return {
        "statusCode": 200,
        "body": "Processed SQS messages"
    }