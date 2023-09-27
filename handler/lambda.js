import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({});

exports.lambda = async function (event, context) {
  // Get the topic ARN from the environment variables.
  const topicArn = process.env.TOPIC_ARN;

  // Create a message object.
  const message = {
    Message: event.message,
  };

  // Publish the message to the topic.
  // const result = await sns
  //   .publish({
  //     TopicArn: topicArn,
  //     Message: JSON.stringify(message),
  //   })
  //   .promise();
  const result = await sns.send(
    new PublishCommand({ Message: "Test Message", TopicArn: topicArn })
  );

  // Log the result.
  console.log("Published message to topic:", result);

  // Return a success response.
  return {
    statusCode: 200,
    body: JSON.stringify("Message published successfully!"),
  };
};
