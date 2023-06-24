// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Ethscriptoor {

    bool public isLive = false;

    uint256 public constant PRICE = 0.005 * 1 ether; // Change Price
    uint256 public constant MAX_SUPPLY = 5_555; // Change Total Supply
    uint256 public totalSupply = 0; // Change to a different number if pre-ethscribing anything in the collection

    address public constant DEPLOYER = 0x00000000000000000000000000000000; // Change to Deployer address in .env

    event Mint(address indexed minter, uint256 indexed amount, uint256 startID, uint256 endID);

    constructor() {
    }
    
    function setLive(bool status) public {
        if (msg.sender != DEPLOYER) {
            revert("OwnerOnly");
        }
        isLive = status;
    }

    function mint(uint256 amount) public payable {
        if (!isLive) {
            revert("MintIsNotLive");
        }
        if (amount <= 0) {
            revert("NoZeroMints");
        }
        if (msg.sender != tx.origin) {
            revert("HumansOnly");
        }

        if (totalSupply + amount > MAX_SUPPLY) {
            revert("SupplyLimitReached");
        }

        if (msg.value != (amount * PRICE)) {
            revert("InvalidValue");
        }

        unchecked {
            totalSupply += amount;
        }

        (bool success,) = DEPLOYER.call{value: msg.value}("");
        if (!success) {
            revert("FailedToTransfer");
        }
        
        emit Mint(msg.sender, amount, (totalSupply-amount)+1, totalSupply);
    }

}