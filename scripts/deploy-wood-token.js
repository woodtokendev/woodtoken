// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');
const estimateDeployGas = require('../utils/estimateDeployGas');
const { hiddenInput, input } = require('../utils/inputUtils');

async function main() {

  console.log("\nTo deploy, you will need to provide the private key of the account to deploy from.\nThe key will only ever exist in memory within the script and is never saved or persisted in any way.")
  const key = await hiddenInput("Enter private key: ");
  const wallet = new hre.ethers.Wallet(key);
  const connectedWallet = await wallet.connect(hre.ethers.provider);

  const WoodToken = await hre.ethers.getContractFactory('WoodToken', connectedWallet);
  
  const { gasEstimate, gasPrice } = await estimateDeployGas(WoodToken, connectedWallet);
  const totalGas = gasEstimate.mul(gasPrice);

  console.log(`\nEstimated gas price: ${hre.ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
  console.log(`Estimated gas limit: ${gasEstimate.toString()}`);
  console.log(`Estimated total gas fee: ${hre.ethers.utils.formatUnits(totalGas, 'ether')} ETH\n`);

  const confirm = await input("Type 'DEPLOY' to confirm and deploy contract: ");

  if(confirm !== 'DEPLOY'){
    console.log('Deployment cancelled\n');
    return;
  }
  
  process.stdout.write('Sending transaction...')

  const token = await WoodToken.deploy();

  process.stdout.write('done\nWaiting for confirmations (this could take some time)...');

  await token.deployed();

  process.stdout.write('done\n\n');

  console.log('WoodToken deployed to:', token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
