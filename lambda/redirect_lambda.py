import json
import boto3
import time

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UrlShortener')

def lambda_handler(event, context):

    try:
        short_code = event['pathParameters']['shortCode']

        response = table.get_item(
            Key={
                'shortCode': short_code
            }
        )

        if 'Item' not in response:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": "URL not found"})
            }

        item = response['Item']

        long_url = item.get('longUrl')

        expiry_time = item.get('expiryTime')

        if expiry_time:
            current_time = int(time.time())

            if current_time > int(expiry_time):
                return {
                    "statusCode": 410,
                    "body": json.dumps({
                        "message": "URL expired"
                    })
                }

        table.update_item(
            Key={'shortCode': short_code},
            UpdateExpression="SET clickCount = if_not_exists(clickCount, :start) + :inc",
            ExpressionAttributeValues={
                ":start": 0,
                ":inc": 1
            }
        )

        return {
            "statusCode": 301,
            "headers": {
                "Location": long_url,
                "Cache-Control": "no-cache"
            }
        }

    except Exception as e:
        print("Error:", str(e))

        return {
            "statusCode": 500,
            "body": json.dumps({
                "message": "Internal server error"
            })
        }