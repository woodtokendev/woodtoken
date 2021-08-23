const hre = require('hardhat');

const zeroAddress = '0x0000000000000000000000000000000000000000';

async function getAllAddresses(contract){
    const result = new Set();
    const events = await contract.queryFilter('Transfer');

    events.forEach(event => {
        result.add(event.args.from);
        result.add(event.args.to);
    })

    // remove the zero address (initial mint/burns)
    if(result.has(zeroAddress)){
        result.delete(zeroAddress);
    }

    return [...result];
}

module.exports = getAllAddresses;