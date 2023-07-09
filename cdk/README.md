# Cloud Development Kit (CDK)

CDK is a software development framework for defining cloud infrastructure in
code and provisioning it through AWS CloudFormation.

To use the CDK locally, complete the following instructions to set up
your local python environment.

## Create a python virtual environment

There are two options:

### Use pyenv

→ Install https://github.com/pyenv/pyenv

Note that if you use Homebrew, you need to install two packages:

```sh
brew install pyenv
brew install pyenv-virtualenv
```

→ Once `pyenv` is install, do the following one-time steps:

```sh
pyenv install 3.8.1
pyenv virtualenv 3.8.1 app-cdk
```

#### Activating pyenv

Virtual environments are transient; they existing only the context of a shell.

→ Before you can activate `pyenv`, it must be loaded into your shell:

```sh
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```

In order to avoid having to run this every time, you can add it to your shell
profile.

→ Now you can activate the environment:

```sh
pyenv activate app-cdk
```

This will add an indicator to your prompt.  When you're done, you can `pyenv
deactivate`, though it will be gone automatically when you exit the shell.

### Use python virtualenv

```sh
python3 -m venv .env
source .env/bin/activate
```

## Install python packages

→ Once your virtual environment is activated, run the following command in the
`cdk` folder:

```sh
pip install -r requirements.txt
```

This does not need to be done again unless the requirements change, which should
be rare.

## Install AWSCLI

→ Run `brew install awscli` or use one of the other installation methods:

https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html

## Set up your AWS credentials for AWSCLI using your secret and access key

### AWS configure

- → run `aws configure`
- → enter your access and secret key
- → for region, input `us-east-1`

This will set the credentials as your `default` profile for the AWSCLI.

https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html#cli-quick-configuration

### Manually create profile

Edit `~/.aws/config` and `~/.aws/credentials` with your chosen profile name

https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

## Set environment variable

If you are using a profile for your AWS credentials other than the `default`
profile, you need the following environment variable set to work with cdk

```sh
export AWS_PROFILE='<name-of-profile>'
```

## Install the CDK

Run the following command to install cdk

```sh
npm install -g aws-cdk
```

## Useful commands

You are ready to use the cdk locally!

* `cdk ls -c env=<env>` --> list all stacks in the app
* `cdk synth -c env=<env>` --> emits the synthesized CloudFormation template
* `cdk diff -c env=<env>` --> compare deployed stack with current state
* `cdk docs -c env=<env>` --> open CDK documentation

The `-c` is the context flag that specifies the environment.
The following flags can be used in the context `<env>` for app cdk:
ENVS=['dev', 'uat', 'prod']. For example: `cdk diff -c env=dev`.
