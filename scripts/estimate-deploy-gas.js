const hre = require('hardhat');
const estimateDeployGas = require('../utils/estimateDeployGas');
const { hiddenInput } = require('../utils/inputUtils');

async function main() {
  const key = await hiddenInput('Enter private key of signer: ');
  const wallet = new hre.ethers.Wallet(key);
  const connectedWallet = await wallet.connect(hre.ethers.provider);
  const WoodToken = await hre.ethers.getContractFactory('WoodToken', connectedWallet);
  
  const { gasEstimate, gasPrice } = await estimateDeployGas(WoodToken, connectedWallet);
  const totalGas = gasEstimate.mul(gasPrice);

  console.log(`Estimated gas price: ${hre.ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
  console.log(`Estimated gas limit: ${gasEstimate.toString()}`);
  console.log(`Estimated total gas fee: ${hre.ethers.utils.formatUnits(totalGas, 'ether')} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
