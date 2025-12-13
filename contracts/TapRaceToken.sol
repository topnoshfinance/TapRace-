// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TapRaceToken
 * @dev ERC20 token for the TapRace game economy
 */
contract TapRaceToken is ERC20, Ownable {
    // Game contract address that can interact with tokens
    address public gameContract;
    
    // Maximum supply (100 million tokens)
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    
    event GameContractUpdated(address indexed newGameContract);
    
    constructor() ERC20("TapRace Token", "TAPRACE") Ownable(msg.sender) {
        // Mint initial supply to deployer
        _mint(msg.sender, 10_000_000 * 10**18); // 10M initial supply
    }
    
    /**
     * @dev Set the game contract address
     * @param _gameContract Address of the game contract
     */
    function setGameContract(address _gameContract) external onlyOwner {
        require(_gameContract != address(0), "Invalid address");
        gameContract = _gameContract;
        emit GameContractUpdated(_gameContract);
    }
    
    /**
     * @dev Mint new tokens (only owner, respects max supply)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
    
    /**
     * @dev Burn tokens from caller
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
