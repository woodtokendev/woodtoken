const { expect } = require("chai");
const { ethers } = require("hardhat");
const getAllAddresses = require("../utils/getAllAddresses");

describe("getAllAddresses", function () {

  var token;
  const burnAddress = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';
  const testAddress1 = '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec';
  const testAddress2 = '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65';
  const testAddress3 = '0xFABB0ac9d68B0B445fB7357272Ff202C5651694a';

  before(async () => {
    const WoodToken = await ethers.getContractFactory("WoodToken");
    token = await WoodToken.deploy();
   
    await token.deployed();

    await token.transfer(testAddress1, 10000);
    await token.transfer(testAddress2, 10000);
    await token.transfer(testAddress3, 10000);
  });

  it("Should return all addresses involved in transfers", async () => {
    const myAddress = (await ethers.getSigner()).address;
    const expectedAddresses = [myAddress, burnAddress, testAddress1, testAddress2, testAddress3];

    const addresses = await getAllAddresses(token);
    
    expect(addresses.length).to.equal(expectedAddresses.length);
    expectedAddresses.forEach(address => {
        expect(expectedAddresses).to.contain(address);
    })
  });
});
