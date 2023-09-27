import {
  aws_events,
  aws_events_targets,
  aws_iam,
  aws_lambda,
  aws_sns,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class SnsCronTemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new TextMessagingStack(this, "TextMessagingStack");
  }
}

export class TextMessagingStack extends Stack {
  constructor(scope: Stack, constructId: string, ...kwargs: any[]) {
    super(scope, constructId, ...kwargs);

    // Create an SNS topic.
    const topic = new aws_sns.Topic(this, "TextMessagingTopic");

    // Subscribe the user's phone number to the SNS topic.
    new aws_sns.Subscription(this, "TextMessagingSubscription", {
      topic,
      protocol: aws_sns.SubscriptionProtocol.SMS,
      endpoint: "+14013327084",
    });

    // Create an EventBridge rule that is scheduled to run twice a day.
    const rule1 = new aws_events.Rule(this, "TextMessagingRule9", {
      // schedule: aws_events.Schedule.cron("0 0/12 * * *"),
      schedule: aws_events.Schedule.cron({ hour: "9", minute: "0" }),
    });

    const rule2 = new aws_events.Rule(this, "TextMessagingRule21", {
      schedule: aws_events.Schedule.cron({ hour: "21", minute: "0" }),
    });

    // Create a Lambda function that is triggered by the EventBridge rule.
    const lambdaFunction = new aws_lambda.Function(
      this,
      "TextMessagingLambda",
      {
        runtime: aws_lambda.Runtime.NODEJS_LATEST,
        handler: "handler.lambda",
        code: aws_lambda.Code.fromAsset("handler"),
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
