import boto3

def lambda_handler(event, context):
  sns = boto3.client('sns')

  # Get the topic ARN from the environment variables.
  topic_arn = process.env['TOPIC_ARN']

  # Create a message object.
  message = {
    'Message': 'Test Message',
  }

  # Publish the message to the topic.
  result = sns.publish(TopicArn=topic_arn, Message=json.dumps(message))

  # Log the result.
  print('Published message to topic:', result)

  # Return a success response.
  return {
    'statusCode': 200,
    'body': json.dumps('Message published successfully!'),
  }
