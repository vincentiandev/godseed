// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SeedToken is ERC20, Ownable {
    
    // Mapping to track reputations
    mapping(address => uint256) public reputation;
    
    // Seed planting events
    event SeedPlanted(address indexed planter, uint256 amount, string seedType);
    event GratitudeGiven(address indexed from, address indexed to, uint256 amount);
    
    // Initial supply: 1,000,000 SEED tokens
    constructor() ERC20("Godseed Token", "SEED") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
    
    // Plant a seed (mint tokens for good deed)
    function plantSeed(address planter, uint256 amount, string memory seedType) public onlyOwner {
        _mint(planter, amount);
        reputation[planter] += amount;
        
        emit SeedPlanted(planter, amount, seedType);
    }
    
    // Give gratitude (transfer tokens with message)
    function giveGratitude(address to, uint256 amount, string memory message) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient SEED balance");
        
        _transfer(msg.sender, to, amount);
        reputation[to] += amount / 10; // 10% of gratitude adds to reputation
        
        emit GratitudeGiven(msg.sender, to, amount);
    }
    
    // Check reputation score
    function getReputation(address user) public view returns (uint256) {
        return reputation[user];
    }
}