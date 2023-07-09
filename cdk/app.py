#!/usr/bin/env python3
from aws_cdk import core
from cdk.staticsite import StaticSite
from cdk.gitlab import GitlabIAM
from cdk.alarms import Alarms

#
# CDK Variables
#
REGION ='us-east-1'
ACCOUNT = '166008898541'
APP_NAME='takgov'
EMAILS = ['hostingservices+takgov@mindgrub.com']

cdk_env = core.Environment(account=ACCOUNT, region=REGION)

app = core.App()

#
# Static Website
#
doc_root = 'index.html'
hosted_zone = f'{APP_NAME}.mindgrb.io'
domain_name = f'web.{APP_NAME}.mindgrb.io'
bucket_name = f'{APP_NAME}-web-app'
existing_cert_arn = None
webAppStack = StaticSite(app, f'{APP_NAME}-web',
    app_name=APP_NAME,
    doc_root=doc_root,
    domain_name=domain_name,
    existing_cert_arn=existing_cert_arn,
    hosted_zone=hosted_zone,
    bucket_name=bucket_name,
    env=cdk_env
)

#
# IAM Gitlab User
#
gitlab = GitlabIAM(app, f'{APP_NAME}-gitlab',
    app_name=APP_NAME,
    env=cdk_env
)

#
# CloudWatch Alarms
#
alarmStack = Alarms(app, f'{APP_NAME}-alarms',
    app_name=APP_NAME,
    emails=EMAILS,
    distribution_id=webAppStack.distribution_id,
    env=cdk_env
)

app.synth()
