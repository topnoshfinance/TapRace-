import { expect } from "chai";
import { ethers } from "hardhat";
import { TapRaceToken, GameContract } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("TapRace Contracts", function () {
  let tapRaceToken: TapRaceToken;
  let gameContract: GameContract;
  let owner: HardhatEthersSigner;
  let player1: HardhatEthersSigner;
  let player2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();

    // Deploy TapRaceToken
    const TapRaceTokenFactory = await ethers.getContractFactory("TapRaceToken");
    tapRaceToken = await TapRaceTokenFactory.deploy();
    await tapRaceToken.waitForDeployment();

    // Deploy GameContract
    const GameContractFactory = await ethers.getContractFactory("GameContract");
    gameContract = await GameContractFactory.deploy(await tapRaceToken.getAddress());
    await gameContract.waitForDeployment();

    // Set game contract in token
    await tapRaceToken.setGameContract(await gameContract.getAddress());

    // Transfer tokens to players for testing
    const tokenAmount = ethers.parseEther("1000");
    await tapRaceToken.transfer(player1.address, tokenAmount);
    await tapRaceToken.transfer(player2.address, tokenAmount);
  });

  describe("TapRaceToken", function () {
    it("Should deploy with correct name and symbol", async function () {
      expect(await tapRaceToken.name()).to.equal("TapRace Token");
      expect(await tapRaceToken.symbol()).to.equal("TAPRACE");
    });

    it("Should have correct initial supply", async function () {
      const expectedSupply = ethers.parseEther("10000000"); // 10M tokens
      expect(await tapRaceToken.totalSupply()).to.equal(expectedSupply);
    });

    it("Should allow owner to mint tokens within max supply", async function () {
      const mintAmount = ethers.parseEther("1000");
      await tapRaceToken.mint(player1.address, mintAmount);
      expect(await tapRaceToken.balanceOf(player1.address)).to.be.gt(0);
    });

    it("Should allow users to burn their tokens", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialBalance = await tapRaceToken.balanceOf(player1.address);
      await tapRaceToken.connect(player1).burn(burnAmount);
      const finalBalance = await tapRaceToken.balanceOf(player1.address);
      expect(initialBalance - finalBalance).to.equal(burnAmount);
    });
  });

  describe("GameContract", function () {
    it("Should deploy with correct token address", async function () {
      expect(await gameContract.tapRaceToken()).to.equal(await tapRaceToken.getAddress());
    });

    it("Should start a new round", async function () {
      await gameContract.startRound();
      expect(await gameContract.roundActive()).to.be.true;
      expect(await gameContract.currentRoundId()).to.equal(1);
    });

    it("Should not allow starting a round when one is active", async function () {
      await gameContract.startRound();
      await expect(gameContract.startRound()).to.be.revertedWith("Round already active");
    });

    it("Should allow players to tap after approving tokens", async function () {
      await gameContract.startRound();
      
      const tapCost = ethers.parseEther("0.03");
      await tapRaceToken.connect(player1).approve(await gameContract.getAddress(), tapCost * 10n);
      
      await gameContract.connect(player1).tap();
      
      const [tapCount] = await gameContract.getPlayerRoundData(1, player1.address);
      expect(tapCount).to.equal(1);
    });

    it("Should accumulate pot from taps", async function () {
      await gameContract.startRound();
      
      const tapCost = ethers.parseEther("0.03");
      await tapRaceToken.connect(player1).approve(await gameContract.getAddress(), tapCost * 10n);
      await tapRaceToken.connect(player2).approve(await gameContract.getAddress(), tapCost * 10n);
      
      await gameContract.connect(player1).tap();
      await gameContract.connect(player2).tap();
      
      const round = await gameContract.rounds(1);
      expect(round.totalPot).to.equal(tapCost * 2n);
    });

    it("Should determine winner correctly", async function () {
      await gameContract.startRound();
      
      const tapCost = ethers.parseEther("0.03");
      await tapRaceToken.connect(player1).approve(await gameContract.getAddress(), tapCost * 10n);
      await tapRaceToken.connect(player2).approve(await gameContract.getAddress(), tapCost * 10n);
      
      // Player 1 taps 3 times
      await gameContract.connect(player1).tap();
      await ethers.provider.send("evm_increaseTime", [1]);
      await gameContract.connect(player1).tap();
      await ethers.provider.send("evm_increaseTime", [1]);
      await gameContract.connect(player1).tap();
      
      // Player 2 taps 2 times
      await gameContract.connect(player2).tap();
      await ethers.provider.send("evm_increaseTime", [1]);
      await gameContract.connect(player2).tap();
      
      // Fast forward to end of round
      await ethers.provider.send("evm_increaseTime", [30]);
      await ethers.provider.send("evm_mine", []);
      
      await gameContract.endRound();
      
      const round = await gameContract.rounds(1);
      expect(round.winner).to.equal(player1.address);
    });

    it("Should transfer pot to winner on finalization", async function () {
      await gameContract.startRound();
      
      const tapCost = ethers.parseEther("0.03");
      await tapRaceToken.connect(player1).approve(await gameContract.getAddress(), tapCost * 10n);
      
      await gameContract.connect(player1).tap();
      
      const initialBalance = await tapRaceToken.balanceOf(player1.address);
      
      // Fast forward and end round
      await ethers.provider.send("evm_increaseTime", [30]);
      await ethers.provider.send("evm_mine", []);
      
      await gameContract.endRound();
      await gameContract.finalizeRound(1);
      
      const finalBalance = await tapRaceToken.balanceOf(player1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });
});
