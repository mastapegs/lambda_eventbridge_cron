import { APIGatewayEvent, APIGatewayProxyCallback, Context } from "aws-lambda";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

const client = new SNSClient();

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback,
): Promise<void> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const response = await client.send(
    new PublishCommand({
      Message: "Test Message",
      TopicArn: process.env.TOPIC_ARN,
      PhoneNumber: "14013327084",
    }),
  );

  console.log(response);

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: "hello world",
    }),
  });
};
