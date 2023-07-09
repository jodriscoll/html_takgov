from aws_cdk import (core, aws_s3, aws_ssm, aws_iam)
import json

class GitlabIAM(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:

        app_name = kwargs.pop('app_name', None)
        username = f'{app_name}-gitlab'

        super().__init__(scope, id, **kwargs)

        gitlab_user = aws_iam.User(self,
            f'{app_name}-gitlab-user',
            user_name=username
        )

        gitlab_user.add_to_policy(
            aws_iam.PolicyStatement(
                sid=f'{app_name}gitlab',
                effect=aws_iam.Effect.ALLOW,
                actions=[
                     "s3:*",
                     "cloudfront:*",
                ],
                resources=[
                    "*"
                ]
            )
        )

        access_key = aws_iam.CfnAccessKey(self,
            f'{app_name}-gitlab-user-access',
            user_name=username,
            status='Active',
            serial=1
        )
        access_key.node.add_dependency(gitlab_user)

        aws_ssm.StringParameter(self,
            f'{app_name}-gitlab-param',
            description=f'{app_name} Gitlab IAM User Credentials',
            parameter_name=f'/{app_name}/GITLAB_IAM_USER',
            string_value=access_key.ref + ' | ' + access_key.attr_secret_access_key,
        )
