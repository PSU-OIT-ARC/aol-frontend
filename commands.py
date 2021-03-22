from emcee.runner.config import YAMLCommandConfiguration
from emcee.runner import configs

from emcee.commands.deploy import deploy
from emcee.deploy import deployer
from emcee.deploy.javascript import LocalProcessor, Deployer
from emcee.backends.aws.deploy import S3RemoteProcessor
from emcee.backends.aws.infrastructure.commands import *

configs.load(YAMLCommandConfiguration)


@deployer()
class AOLFrontendDeployer(Deployer):
    remote_processor_cls = S3RemoteProcessor
