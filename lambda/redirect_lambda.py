import json
import boto3
import time
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UrlShortener')

sqs = boto3.client('sqs')

QUEUE_URL = "https://sqs.ap-south-1.amazonaws.com/918792379419/url-shortener-queue"

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj)
        return super().default(obj)

def response(status_code, body):

    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://bit.moinnaik.in"
        },
        "body": json.dumps(body, cls=DecimalEncoder)
    }

def lambda_handler(event, context):

    try:

        short_code = event["pathParameters"]["shortCode"]

        db_response = table.get_item(
            Key={
                "shortCode": short_code
            }
        )

        item = db_response.get("Item")

        if not item:

            return response(404, {
                "message": "URL not found"
            })

        expiry_time = item.get("expiryTime")

        if expiry_time:

            if int(time.time()) > int(expiry_time):

                return response(410, {
                    "message": "URL expired"
                })

        # Send click event to SQS
        sqs.send_message(
            QueueUrl=QUEUE_URL,
            MessageBody=json.dumps({
                "shortCode": short_code
            })
        )

        return response(200, {
            "success": True,
            "longUrl": item["longUrl"]
        })

    except Exception as e:

        print(str(e))

        return response(500, {
            "message": "Internal server error"
        })