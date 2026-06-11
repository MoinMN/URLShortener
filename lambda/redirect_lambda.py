import json
import boto3

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

        long_url = response['Item']['longUrl']

        return {
            "statusCode": 301,
            "headers": {
                "Location": long_url
            }
        }

    except Exception as e:
        print("Error:", str(e))

        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal error"})
        }