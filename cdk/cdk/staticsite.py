from aws_cdk import (core, aws_s3, aws_route53, aws_route53_targets,
    aws_certificatemanager, aws_cloudfront)

class StaticSite(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:

        app_name = kwargs.pop('app_name', None)
        doc_root = kwargs.pop('doc_root', None)
        domain_name = kwargs.pop('domain_name', None)
        hosted_zone = kwargs.pop('hosted_zone', None)
        existing_cert_arn = kwargs.pop('existing_cert_arn', None)
        bucket_name = kwargs.pop('bucket_name', None)

        super().__init__(scope, id, **kwargs)

        zone = aws_route53.HostedZone.from_lookup(self,
            f'{app_name}-zone',
            domain_name=hosted_zone
        )

        if existing_cert_arn:
            cert = aws_certificatemanager.Certificate.from_certificate_arn(
                self,
                f'{app_name}-acmcert',
                existing_cert_arn
            )
        else:
            cert = aws_certificatemanager.DnsValidatedCertificate(self,
                f'{app_name}-site-cert',
                domain_name=domain_name,
                hosted_zone=zone
            )

        source_bucket = aws_s3.Bucket(self, f'{app_name}-bucket',
            website_index_document=doc_root,
            bucket_name=bucket_name,
            public_read_access=False,
            versioned=True,
            encryption=aws_s3.BucketEncryption.S3_MANAGED
        )

        error_config = [
            aws_cloudfront.CfnDistribution.CustomErrorResponseProperty(
                error_code=500,
                error_caching_min_ttl=0
            ),
            aws_cloudfront.CfnDistribution.CustomErrorResponseProperty(
                error_code=501,
                error_caching_min_ttl=0
            ),
            aws_cloudfront.CfnDistribution.CustomErrorResponseProperty(
                error_code=502,
                error_caching_min_ttl=0
            ),
            aws_cloudfront.CfnDistribution.CustomErrorResponseProperty(
                error_code=503,
                error_caching_min_ttl=0
            ),
            aws_cloudfront.CfnDistribution.CustomErrorResponseProperty(
                error_code=504,
                error_caching_min_ttl=0
            ),
            aws_cloudfront.CfnDistribution.CustomErrorResponseProperty(
                error_code=403,
                response_code=200,
                response_page_path=f'/{doc_root}'
            ),
            aws_cloudfront.CfnDistribution.CustomErrorResponseProperty(
                error_code=404,
                response_code=200,
                response_page_path=f'/{doc_root}'
            )
        ]

        origin_access_id = aws_cloudfront.OriginAccessIdentity(self,
            f'{app_name}-origin-access',
            comment=f'CloudFront origin for S3 bucket {bucket_name}'
        )

        distribution = aws_cloudfront.CloudFrontWebDistribution(self,
            f'{app_name}-site-distro',
            default_root_object=doc_root,
            alias_configuration=aws_cloudfront.AliasConfiguration(
                acm_cert_ref=cert.certificate_arn,
                names=[domain_name],
                ssl_method=aws_cloudfront.SSLMethod.SNI,
                security_policy=aws_cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016
            ),
            error_configurations=error_config,
            origin_configs=[
                aws_cloudfront.SourceConfiguration(
                    s3_origin_source=aws_cloudfront.S3OriginConfig(
                        s3_bucket_source=source_bucket,
                        origin_access_identity=origin_access_id
                    ),
                    behaviors=[
                        aws_cloudfront.Behavior(
                            is_default_behavior=True,
                            allowed_methods=aws_cloudfront.CloudFrontAllowedMethods.GET_HEAD,
                            compress=True,
                            default_ttl=core.Duration.seconds(86400),
                            max_ttl=core.Duration.seconds(31536000),
                            min_ttl=core.Duration.seconds(0),
                        ),
                    ]
                )
            ]
        )

        aws_route53.ARecord(self, f'{app_name}-dns-alias',
            record_name=domain_name,
            target=aws_route53.AddressRecordTarget.from_alias(
                aws_route53_targets.CloudFrontTarget(distribution)
            ),
            zone=zone
        )

        self.distribution_id = distribution.distribution_id
