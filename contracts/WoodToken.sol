// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./Ownable.sol";

contract WoodToken is ERC20, Ownable {
    using SafeMath for uint256;
    
    uint256 private immutable _transactionLimit;
    uint256 private immutable _transactionFee;
    uint256 private immutable _burnAmount;
    
    address public immutable _reserveAddress;

    event BurnAmountChanged(uint256 amount);
    
    constructor() ERC20("WoodToken", "WOOD") {
        uint256 _initialSupply = 340 * (10 ** 10) * (10 ** 18);
        _transactionLimit = 15200000000 * (10 ** 18);
        _transactionFee = 0.00304 * (10 ** 5);
        _burnAmount = 15000000000 * (10 ** 18);
        
        address reserve = address(0xC5C6b29Edbee4187DE5aE85c9D8493D140cdbf62);
        _reserveAddress = reserve;
        
        uint256 burnWalletInitialAmount = (_initialSupply * 35) / 100;

        _mint(msg.sender, _initialSupply);
        _transfer(msg.sender, reserve, burnWalletInitialAmount);
    }
    
    function transfer(address recipient, uint256 amount) public override returns(bool){
        if(!(msg.sender == owner() || msg.sender == address(this))){
            require(amount <= _transactionLimit, 'WOOD: transfer amount exceeds single transaction maximum');
        }
        require(amount <= balanceOf(msg.sender), 'ERC20: transfer amount exceeds balance');
        
        uint256 feeAmount = calculateTransactionFee(amount);
        uint256 transferAmount = amount - feeAmount;
                
        _transfer(msg.sender, _reserveAddress, feeAmount);
        _transfer(msg.sender, recipient, transferAmount);

        return true;
    }
    
    function calculateTransactionFee(uint256 amount) private view returns (uint256) {
        if(msg.sender == owner() || msg.sender == address(this)){
            return 0;
        }
        return (amount * _transactionFee) / (10 ** 5);
    }

    function burnFromReserve() onlyOwner public {
        _burn(_reserveAddress, _transactionLimit);
    }

    function stakeTokens(uint256 amount) public {
        transfer(address(this), amount);
        uint256 currentAllowance = allowance(address(this), msg.sender);
        _approve(address(this), msg.sender, currentAllowance + amount);
    }

    function unstakeTokens() public {
        uint256 lockedTokenAmount = allowance(address(this), msg.sender);
        transferFrom(address(this), msg.sender, lockedTokenAmount);
    }
}