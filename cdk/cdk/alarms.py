from aws_cdk import (core, aws_cloudwatch, aws_cloudwatch_actions, aws_sns)

class Alarms(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:

        app_name = kwargs.pop('app_name', None)
        emails = kwargs.pop('emails', None)
        distribution_id = kwargs.pop('distribution_id', None)

        super().__init__(scope, id, **kwargs)

        sns_topic = aws_sns.Topic(self,
            f'{app_name}-cw-alarm-sns-topic',
            display_name= f'{app_name}-SnsTopic',
            topic_name=f'{app_name}-SnsTopic'
        )

        for email in emails:
            aws_sns.Subscription(self, email,
                endpoint=email,
                protocol=aws_sns.SubscriptionProtocol.EMAIL,
                topic=sns_topic
            )

        metric5xx = aws_cloudwatch.Metric(
            namespace="AWS/CloundFront",
            metric_name="5xxErrorRate",
            dimensions= {
                "Region":"Global",
                "DistributionId": distribution_id
            },
            period = core.Duration.seconds(60),
            statistic="sum",
        )

        alarm5xx = aws_cloudwatch.Alarm(self,
            "Alarm-5xxErrorRate-Over-Threshold",
            metric=metric5xx,
            threshold=10,
            evaluation_periods=10,
            datapoints_to_alarm=10,
            comparison_operator=aws_cloudwatch.ComparisonOperator(
                'GREATER_THAN_OR_EQUAL_TO_THRESHOLD'
            ),
            alarm_description='CloudFront 5xx Error Rate',
            treat_missing_data=aws_cloudwatch.TreatMissingData.NOT_BREACHING
        )

        alarm5xx.add_alarm_action(aws_cloudwatch_actions.SnsAction(sns_topic))
