// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GameContract
 * @dev Main game logic for TapRace - manages rounds, taps, and payouts
 */
contract GameContract is Ownable, ReentrancyGuard {
    IERC20 public tapRaceToken;
    
    // Cost per tap in token units (0.03 tokens = 0.03 * 10^18)
    uint256 public constant TAP_COST = 30000000000000000; // 0.03 tokens
    
    // Round duration in seconds
    uint256 public constant ROUND_DURATION = 30;
    
    // Anti-cheat: minimum time between taps per user (in milliseconds equivalent)
    uint256 public constant MIN_TAP_INTERVAL = 50; // 50ms = 20 taps/second max
    
    // Round structure
    struct Round {
        uint256 roundId;
        uint256 startTime;
        uint256 endTime;
        address winner;
        uint256 totalPot;
        bool finalized;
    }
    
    // Player data per round
    struct PlayerRoundData {
        uint256 tapCount;
        uint256 lastTapTime;
        uint256 totalSpent;
    }
    
    // Current round ID
    uint256 public currentRoundId;
    
    // Mapping of round ID to Round data
    mapping(uint256 => Round) public rounds;
    
    // Mapping of round ID => player address => player data
    mapping(uint256 => mapping(address => PlayerRoundData)) public playerRoundData;
    
    // Mapping of round ID => array of player addresses
    mapping(uint256 => address[]) public roundPlayers;
    
    // Round active status
    bool public roundActive;
    
    // Events
    event RoundStarted(uint256 indexed roundId, uint256 startTime, uint256 endTime);
    event TapRecorded(uint256 indexed roundId, address indexed player, uint256 tapCount, uint256 totalSpent);
    event RoundEnded(uint256 indexed roundId, address indexed winner, uint256 prize);
    event RoundFinalized(uint256 indexed roundId, address indexed winner, uint256 prize);
    
    constructor(address _tokenAddress) Ownable(msg.sender) {
        require(_tokenAddress != address(0), "Invalid token address");
        tapRaceToken = IERC20(_tokenAddress);
        currentRoundId = 0;
        roundActive = false;
    }
    
    /**
     * @dev Start a new round
     */
    function startRound() external onlyOwner {
        require(!roundActive, "Round already active");
        
        currentRoundId++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + ROUND_DURATION;
        
        rounds[currentRoundId] = Round({
            roundId: currentRoundId,
            startTime: startTime,
            endTime: endTime,
            winner: address(0),
            totalPot: 0,
            finalized: false
        });
        
        roundActive = true;
        
        emit RoundStarted(currentRoundId, startTime, endTime);
    }
    
    /**
     * @dev Record a tap from a player
     */
    function tap() external nonReentrant {
        require(roundActive, "No active round");
        require(block.timestamp < rounds[currentRoundId].endTime, "Round ended");
        
        PlayerRoundData storage playerData = playerRoundData[currentRoundId][msg.sender];
        
        // Anti-cheat: check minimum tap interval
        if (playerData.lastTapTime > 0) {
            require(
                block.timestamp >= playerData.lastTapTime + (MIN_TAP_INTERVAL / 1000),
                "Tapping too fast"
            );
        }
        
        // Transfer tap cost from player to contract
        require(
            tapRaceToken.transferFrom(msg.sender, address(this), TAP_COST),
            "Token transfer failed"
        );
        
        // First tap from this player - add to players list
        if (playerData.tapCount == 0) {
            roundPlayers[currentRoundId].push(msg.sender);
        }
        
        // Update player data
        playerData.tapCount++;
        playerData.lastTapTime = block.timestamp;
        playerData.totalSpent += TAP_COST;
        
        // Update round pot
        rounds[currentRoundId].totalPot += TAP_COST;
        
        emit TapRecorded(currentRoundId, msg.sender, playerData.tapCount, playerData.totalSpent);
    }
    
    /**
     * @dev End the current round and determine winner
     */
    function endRound() external onlyOwner {
        require(roundActive, "No active round");
        require(block.timestamp >= rounds[currentRoundId].endTime, "Round not finished");
        
        roundActive = false;
        
        // Determine winner (player with most taps)
        address winner = address(0);
        uint256 maxTaps = 0;
        
        address[] memory players = roundPlayers[currentRoundId];
        for (uint256 i = 0; i < players.length; i++) {
            uint256 taps = playerRoundData[currentRoundId][players[i]].tapCount;
            if (taps > maxTaps) {
                maxTaps = taps;
                winner = players[i];
            }
        }
        
        rounds[currentRoundId].winner = winner;
        
        emit RoundEnded(currentRoundId, winner, rounds[currentRoundId].totalPot);
    }
    
    /**
     * @dev Finalize round and transfer prize to winner
     */
    function finalizeRound(uint256 roundId) external onlyOwner nonReentrant {
        Round storage round = rounds[roundId];
        require(!round.finalized, "Round already finalized");
        require(round.winner != address(0), "No winner determined");
        
        round.finalized = true;
        
        // Transfer entire pot to winner
        if (round.totalPot > 0) {
            require(
                tapRaceToken.transfer(round.winner, round.totalPot),
                "Prize transfer failed"
            );
        }
        
        emit RoundFinalized(roundId, round.winner, round.totalPot);
    }
    
    /**
     * @dev Get player data for a specific round
     */
    function getPlayerRoundData(uint256 roundId, address player) 
        external 
        view 
        returns (uint256 tapCount, uint256 lastTapTime, uint256 totalSpent) 
    {
        PlayerRoundData memory data = playerRoundData[roundId][player];
        return (data.tapCount, data.lastTapTime, data.totalSpent);
    }
    
    /**
     * @dev Get all players for a specific round
     */
    function getRoundPlayers(uint256 roundId) external view returns (address[] memory) {
        return roundPlayers[roundId];
    }
    
    /**
     * @dev Get current round info
     */
    function getCurrentRound() external view returns (
        uint256 roundId,
        uint256 startTime,
        uint256 endTime,
        uint256 totalPot,
        bool active
    ) {
        if (currentRoundId == 0) {
            return (0, 0, 0, 0, false);
        }
        Round memory round = rounds[currentRoundId];
        return (round.roundId, round.startTime, round.endTime, round.totalPot, roundActive);
    }
    
    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = tapRaceToken.balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        require(tapRaceToken.transfer(owner(), balance), "Transfer failed");
    }
}
