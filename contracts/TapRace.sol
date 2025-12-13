// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TapRaceToken
 * @dev ERC20 token for TapRace game - required to participate
 */
contract TapRaceToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18; // 1 million tokens
    
    constructor() ERC20("TapRace Token", "TAPRACE") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Mint new tokens (only owner)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Burn tokens
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}

/**
 * @title TapRaceGame
 * @dev Main game contract for TapRace
 */
contract TapRaceGame is Ownable {
    TapRaceToken public token;
    
    // Game configuration
    // Note: ROUND_DURATION is 5 minutes to allow multiple 30-second game sessions 
    // within each round. Players can submit multiple game scores during a round.
    uint256 public constant ROUND_DURATION = 5 minutes;
    uint256 public constant TAP_COST = 1 * 10**18; // 1 TAP token per tap
    uint256 public constant MIN_TOKEN_BALANCE = 100 * 10**18; // Minimum 100 tokens to play
    
    struct Round {
        uint256 roundId;
        uint256 startTime;
        uint256 endTime;
        uint256 prizePool;
        address winner;
        uint256 winningScore;
        bool finalized;
    }
    
    struct PlayerScore {
        address player;
        uint256 score;
        uint256 contribution;
        uint256 timestamp;
    }
    
    mapping(uint256 => Round) public rounds;
    mapping(uint256 => mapping(address => PlayerScore)) public roundScores;
    mapping(uint256 => address[]) public roundPlayers;
    
    uint256 public currentRoundId;
    uint256 public totalRounds;
    
    event RoundStarted(uint256 indexed roundId, uint256 startTime, uint256 endTime);
    event ScoreSubmitted(uint256 indexed roundId, address indexed player, uint256 score, uint256 contribution);
    event RoundFinalized(uint256 indexed roundId, address indexed winner, uint256 prize);
    event PrizeWithdrawn(uint256 indexed roundId, address indexed winner, uint256 amount);
    
    constructor(address _tokenAddress) Ownable(msg.sender) {
        token = TapRaceToken(_tokenAddress);
        _startNewRound();
    }
    
    /**
     * @dev Check if player has enough tokens to participate
     */
    modifier hasTokens() {
        require(token.balanceOf(msg.sender) >= MIN_TOKEN_BALANCE, "Insufficient token balance");
        _;
    }
    
    /**
     * @dev Submit taps for current round
     * @param tapCount Number of taps to submit
     * Note: Caller must have approved this contract to spend at least (tapCount * TAP_COST) tokens
     * before calling this function, or the transferFrom will fail with "ERC20: insufficient allowance"
     */
    function submitTaps(uint256 tapCount) external hasTokens {
        require(tapCount > 0, "Tap count must be positive");
        require(block.timestamp < rounds[currentRoundId].endTime, "Round has ended");
        
        uint256 cost = tapCount * TAP_COST;
        
        // Transfer TAP tokens from player to contract
        require(token.transferFrom(msg.sender, address(this), cost), "Token transfer failed");
        
        Round storage round = rounds[currentRoundId];
        
        // Update or create player score
        // Check if player already exists to avoid duplicate entries
        if (roundScores[currentRoundId][msg.sender].player == address(0)) {
            roundPlayers[currentRoundId].push(msg.sender);
            roundScores[currentRoundId][msg.sender].player = msg.sender;
        }
        roundScores[currentRoundId][msg.sender].score += tapCount;
        roundScores[currentRoundId][msg.sender].contribution += cost;
        roundScores[currentRoundId][msg.sender].timestamp = block.timestamp;
        
        round.prizePool += cost;
        
        emit ScoreSubmitted(currentRoundId, msg.sender, tapCount, cost);
    }
    
    /**
     * @dev Finalize round and determine winner
     */
    function finalizeRound() external {
        Round storage round = rounds[currentRoundId];
        require(block.timestamp >= round.endTime, "Round not ended yet");
        require(!round.finalized, "Round already finalized");
        
        if (roundPlayers[currentRoundId].length == 0) {
            round.finalized = true;
            _startNewRound();
            return;
        }
        
        // Find winner (highest score)
        address winner = address(0);
        uint256 highestScore = 0;
        
        for (uint256 i = 0; i < roundPlayers[currentRoundId].length; i++) {
            address player = roundPlayers[currentRoundId][i];
            uint256 score = roundScores[currentRoundId][player].score;
            
            if (score > highestScore) {
                highestScore = score;
                winner = player;
            }
        }
        
        round.winner = winner;
        round.winningScore = highestScore;
        round.finalized = true;
        
        emit RoundFinalized(currentRoundId, winner, round.prizePool);
        
        // Start new round
        _startNewRound();
    }
    
    /**
     * @dev Winner withdraws prize
     */
    function withdrawPrize(uint256 roundId) external {
        Round storage round = rounds[roundId];
        require(round.finalized, "Round not finalized");
        require(round.winner == msg.sender, "Not the winner");
        require(round.prizePool > 0, "Prize already withdrawn");
        
        uint256 prize = round.prizePool;
        round.prizePool = 0;
        
        require(token.transfer(msg.sender, prize), "Token transfer failed");
        
        emit PrizeWithdrawn(roundId, msg.sender, prize);
    }
    
    /**
     * @dev Start a new round
     */
    function _startNewRound() internal {
        totalRounds++;
        currentRoundId = totalRounds;
        
        rounds[currentRoundId] = Round({
            roundId: currentRoundId,
            startTime: block.timestamp,
            endTime: block.timestamp + ROUND_DURATION,
            prizePool: 0,
            winner: address(0),
            winningScore: 0,
            finalized: false
        });
        
        emit RoundStarted(currentRoundId, block.timestamp, block.timestamp + ROUND_DURATION);
    }
    
    /**
     * @dev Get current round info
     */
    function getCurrentRound() external view returns (Round memory) {
        return rounds[currentRoundId];
    }
    
    /**
     * @dev Get player score for current round
     */
    function getMyScore() external view returns (PlayerScore memory) {
        return roundScores[currentRoundId][msg.sender];
    }
    
    /**
     * @dev Get leaderboard for a round
     */
    function getRoundLeaderboard(uint256 roundId) external view returns (PlayerScore[] memory) {
        address[] memory players = roundPlayers[roundId];
        PlayerScore[] memory leaderboard = new PlayerScore[](players.length);
        
        for (uint256 i = 0; i < players.length; i++) {
            leaderboard[i] = roundScores[roundId][players[i]];
        }
        
        return leaderboard;
    }
}
