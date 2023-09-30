import {
  aws_events,
  aws_events_targets,
  aws_lambda,
  aws_lambda_nodejs,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class SnsCronTemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an EventBridge rule that is scheduled to run twice a day.
    const EST_TO_UTC_OFFSET = 4;
    const [rule1, rule2] = [9, 21].map((est_time) => {
      const utc_time = (() => {
        const add_offset = est_time + EST_TO_UTC_OFFSET;
        return add_offset > 24 ? add_offset - 24 : add_offset;
      })();
      return utc_time.toString();
    }).map((hour) =>
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

    // Add a target to the EventBridge rule to trigger the Lambda function.
    [rule1, rule2].map((rule) =>
      rule.addTarget(new aws_events_targets.LambdaFunction(lambdaFunction))
    );
  }
}
