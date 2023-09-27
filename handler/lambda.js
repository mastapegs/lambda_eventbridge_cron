const AWS = require("aws-sdk");

const sns = new AWS.SNS();

exports.lambda = async function (event, context) {
  // Get the topic ARN from the environment variables.
  const topicArn = process.env.TOPIC_ARN;

  // Create a message object.
  const message = {
    Message: event.message,
  };

  // Publish the message to the topic.
  const result = await sns
    .publish({
      TopicArn: topicArn,
      Message: JSON.stringify(message),
    })
    .promise();

  // Log the result.
  console.log("Published message to topic:", result);

  // Return a success response.
  return {
    statusCode: 200,
    body: JSON.stringify("Message published successfully!"),
  };
};
