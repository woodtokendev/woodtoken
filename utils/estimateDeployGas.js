async function estimateDeployGas(contractFactory, signer) {
    const deploymentTransaction = contractFactory.getDeployTransaction();
    const gasEstimate = await signer.estimateGas(deploymentTransaction);
    const gasPrice = await hre.ethers.provider.getGasPrice();
    return {
      gasEstimate,
      gasPrice 
    };
}

module.exports = estimateDeployGas;