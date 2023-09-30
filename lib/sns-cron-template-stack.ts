import {
  aws_events,
  aws_events_targets,
  aws_iam,
  aws_lambda,
  aws_lambda_nodejs,
  aws_sns,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class SnsCronTemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an SNS topic.
    const topic = new aws_sns.Topic(this, "TextMessagingTopic");

    // Subscribe the user's phone number to the SNS topic.
    new aws_sns.Subscription(this, "TextMessagingSubscription", {
      topic,
      protocol: aws_sns.SubscriptionProtocol.SMS,
      endpoint: "+14013327084",
    });

    // Create an EventBridge rule that is scheduled to run twice a day.
    const [rule1, rule2] = ["9", "21"].map((hour) =>
      new aws_events.Rule(this, `RuleForHour${hour}`, {
        schedule: aws_events.Schedule.cron({ hour, minute: "0" }),
      })
    );

    const lambdaFunction = new aws_lambda_nodejs.NodejsFunction(
      this,
      "handler",
      {
        runtime: aws_lambda.Runtime.NODEJS_18_X,
      },
    );

    // Add a permission statement to the Lambda function to allow it to publish messages to the SNS topic.
    lambdaFunction.addToRolePolicy(
      new aws_iam.PolicyStatement({
        actions: ["sns:Publish"],
        resources: [topic.topicArn],
      }),
    );

    // Add a target to the EventBridge rule to trigger the Lambda function.
    [rule1, rule2].map((rule) =>
      rule.addTarget(new aws_events_targets.LambdaFunction(lambdaFunction))
    );
  }
}
