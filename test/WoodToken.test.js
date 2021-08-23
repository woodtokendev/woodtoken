const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('WoodToken', () => {
    var subject;
    const reserveAddress = '0xC5C6b29Edbee4187DE5aE85c9D8493D140cdbf62';

    beforeEach(async () => {
        const WoodToken = await ethers.getContractFactory("WoodToken");
        subject = await WoodToken.deploy();
        
        await subject.deployed();
    });

    describe('Contract initialization', () => {
        it('deploys with 65% of tokens belonging to contract creator', async () => {
            const creatorAddress = (await ethers.getSigner()).address;
    
            const balance = await subject.balanceOf(creatorAddress);
            const expectedBalance = (await subject.totalSupply()).mul(65).div(100);
    
            expect(balance).to.equal(expectedBalance);
        });
    
        it('deploys with 35% of tokens belonging to reserve address', async () => {
            const balance = await subject.balanceOf(reserveAddress);
            const expectedBalance = (await subject.totalSupply()).mul(35).div(100);
    
            expect(balance).to.equal(expectedBalance);
        });    
    });

    describe('Contract interaction', () => {
        var subjectAsAddr1;
        beforeEach(async () => {
            const addr1 = await ethers.getSigner(1);
            await subject.transfer(addr1.address, 30000000000);

            subjectAsAddr1 = subject.connect(addr1);
        });

        it('Enforces a 0.304% transaction fee on transfers', async () => {
            const addr2 = await ethers.getSigner(2);
            const reserveInitialBalance = await subject.balanceOf(reserveAddress);
            const transferAmount = 100000;
            const expectedFee = 304;
    
            await subjectAsAddr1.transfer(addr2.address, transferAmount);
    
            const reserveFinalBalance = await subject.balanceOf(reserveAddress);
            const transferAddressFinalBalance = await subject.balanceOf(addr2.address);
    
            expect(reserveFinalBalance).to.equal(reserveInitialBalance.add(expectedFee));
            expect(transferAddressFinalBalance).to.equal(transferAmount - expectedFee);
        });

        it('Enforces a transaction limit of 15,200,000,000', async () => {
            const transferAddress = (await ethers.Wallet.createRandom()).address;
    
            await expect(subjectAsAddr1.transfer(transferAddress, 15200000000)).to.not.be.reverted;
            await expect(subjectAsAddr1.transfer(transferAddress, 15200000001)).to.be.reverted;
        });
    
        it('allows tokens to be staked & unstaked', async () => {
            const creatorAddress = (await ethers.getSigner()).address;
            const initialBalance = await subject.balanceOf(creatorAddress);
    
            await subject.stakeTokens(initialBalance);
    
            expect(await subject.balanceOf(creatorAddress)).to.equal(0);
            expect(await subject.balanceOf(subject.address)).to.equal(initialBalance);
            expect(await subject.allowance(subject.address, creatorAddress)).to.equal(initialBalance);
            
            await subject.unstakeTokens();
    
            expect(await subject.balanceOf(creatorAddress)).to.equal(initialBalance);
            expect(await subject.balanceOf(subject.address)).to.equal(0);
            expect(await subject.allowance(subject.address, creatorAddress)).to.equal(0);
        });

        it('stake enforces transaction limit', async () => {    
            await expect(subjectAsAddr1.stakeTokens(15200000000)).to.not.be.reverted;
            await expect(subjectAsAddr1.stakeTokens(15200000001)).to.be.reverted;
        });
    });
});