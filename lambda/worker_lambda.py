import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UrlShortener')

def lambda_handler(event, context):

    for record in event['Records']:

        body = json.loads(record['body'])

        short_code = body['shortCode']

        table.update_item(
            Key={
                "shortCode": short_code
            },
            UpdateExpression="""
                SET clickCount =
                if_not_exists(clickCount, :zero) + :one
            """,
            ExpressionAttributeValues={
                ":zero": 0,
                ":one": 1
            }
        )

    return {
        "statusCode": 200,
        "body": json.dumps("Processed")
    }