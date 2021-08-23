const { task } = require('hardhat/config');

require('@nomiclabs/hardhat-waffle');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task('balance', 'Prints an account\'s ETH balanace')
  .addParam('account', 'The account\'s balance')
  .setAction(async (taskArgs) => {

    const account = ethers.utils.getAddress(taskArgs.account);
    const signer = await ethers.getSigner(account);
    const balance = await signer.getBalance();

    console.log(ethers.utils.formatUnits(balance, "ether"), "ETH");
  });

task('transfer', 'Transfers ETH from default signer to given account')
  .addParam('account', 'Account to transfer to')
  .addParam('amount', 'Amount of ETH to transfer')
  .setAction(async (taskArgs) => {
    const tx = {
      to: taskArgs.account,
      value: ethers.utils.parseEther(taskArgs.amount)
    }
    const signer = await ethers.getSigner();
    const result = await signer.sendTransaction(tx);
    console.log(result);
  });

//const networks = require('./config/networks.json');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  networks: {
    ropsten: {
      url: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
    },
    mainnet: {
      url: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
    }
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  }
};
