from emcee.runner.config import YAMLCommandConfiguration
from emcee.runner import command, configs, config

from emcee.commands.deploy import deploy
from emcee.deploy.javascript import LocalProcessor, Deployer
from emcee.backends.aws.deploy import S3RemoteProcessor
from emcee.backends.aws.infrastructure.commands import *

configs.load('default', 'commands.yml', YAMLCommandConfiguration)


class AOLFrontendLocalProcessor(LocalProcessor):
    def get_package_manager(self):
        return config.yarn.bin


class AOLFrontendDeployer(Deployer):
    local_processor_cls = AOLFrontendLocalProcessor
    remote_processor_cls = S3RemoteProcessor


@command
def deploy_app(rebuild=True):
    deploy(deployer_class=AOLFrontendDeployer, rebuild=rebuild)
