import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } from "../hardhat.config";
import verify from "../utils/verify";

const deployContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment){
    const { deployments, getNamedAccounts, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const waitBlockConfirmations: number = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    const contract = await deploy("MileChain", {
        from: deployer,
        args: [[]],
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(contract.address, []);
    }
}

export default deployContract;