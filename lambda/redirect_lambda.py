import json
import boto3
import time
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UrlShortener')


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
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(body, cls=DecimalEncoder)
    }


def lambda_handler(event, context):

    try:

        path_params = event.get("pathParameters") or {}
        short_code = path_params.get("shortCode")

        if not short_code:
            return response(400, {
                "message": "shortCode is required"
            })

        # Fetch URL record
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

        long_url = item.get("longUrl")
        expiry_time = item.get("expiryTime")

        # Check expiry
        if expiry_time:

            current_time = int(time.time())

            if current_time > int(expiry_time):
                return response(410, {
                    "message": "URL expired"
                })

        # Increment click count atomically
        click_response = table.update_item(
            Key={
                "shortCode": short_code
            },
            UpdateExpression="""
                SET clickCount =
                if_not_exists(clickCount, :start) + :inc
            """,
            ExpressionAttributeValues={
                ":start": 0,
                ":inc": 1
            },
            ReturnValues="UPDATED_NEW"
        )

        updated_click_count = click_response["Attributes"]["clickCount"]

        return response(200, {
            "success": True,
            "shortCode": short_code,
            "longUrl": long_url,
            "clickCount": updated_click_count,
            "expiryTime": expiry_time
        })

    except Exception as e:

        print(f"ERROR: {str(e)}")

        return response(500, {
            "message": "Internal server error"
        })