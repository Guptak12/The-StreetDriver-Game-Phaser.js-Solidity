// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./nft_contract.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC721/extensions/ERC721URIStorage.sol";

contract CarGame {
    CarSkinNFT public carSkinNFT;
    
    struct Player {
        string ign; // In-Game Name
        address player; // Player's wallet address
        uint highestScore; // Highest score achieved by the player
        uint selectedSkin; // Token ID of the selected skin
        uint latestScore; // Latest score achieved by the player
    }

    mapping(string => address) private ignToAddress; // IGN to player address
    mapping(address => uint) private playerToIndex; // Player address to index in listOfPlayers
    Player[] private listOfPlayers; // List of all players

    // Mapping to store skins owned by each player
    mapping(address => uint[]) private playerSkins; // Player address to list of owned token IDs

    // Score milestones for NFT rewards
    uint[] public scoreMilestones = [100, 500, 1000, 2000, 5000];

    // Events
    event PlayerRegistered(string ign, address player);
    event SkinSelected(address player, uint tokenId);
    event HighestScoreUpdated(address player, uint newHighestScore);
    event LatestScoreUpdated(address player, uint newLatestScore);
    event NFTRewarded(address player, uint tokenId, uint milestone);

    constructor(address _nftContractAddress) {
        carSkinNFT = CarSkinNFT(_nftContractAddress);
    }

    // Register a new player with a unique IGN
    function addPerson(string memory name) public {
        require(ignToAddress[name] == address(0), "This IGN is already taken. Please choose another one.");
        require(playerToIndex[msg.sender] == 0 && (listOfPlayers.length == 0 || listOfPlayers[0].player != msg.sender), "You are already registered!");
        listOfPlayers.push(Player(name, msg.sender, 0, 0, 0)); // Default highest score 0, no skin selected, latest score 0
        ignToAddress[name] = msg.sender;
        playerToIndex[msg.sender] = listOfPlayers.length - 1; // Store player index
        emit PlayerRegistered(name, msg.sender);
    }

    // Select a skin (must own the NFT)
    function selectSkin(uint tokenId) public returns (bool) {
    if (carSkinNFT.ownerOf(tokenId)   != msg.sender) {
        return false; // Player doesn't own the skin
    }

    Player storage player = listOfPlayers[getPlayerIndex(msg.sender)];
    player.selectedSkin = tokenId;
    emit SkinSelected(msg.sender, tokenId);
    
    return true; // Successfully selected the skin
}


    // Update the player's latest score and trigger highest score update if needed
    function updateLatestScore(uint finalScore) public {
        uint playerIndex = getPlayerIndex(msg.sender);
        Player storage player = listOfPlayers[playerIndex];
        player.latestScore = finalScore;
        emit LatestScoreUpdated(msg.sender, finalScore);
        
        updateHighestScore(finalScore);
    }

    // Update the player's highest score and reward NFTs if milestones are reached
    function updateHighestScore(uint finalScore) internal returns (uint) {
        uint playerIndex = getPlayerIndex(msg.sender);
        Player storage player = listOfPlayers[playerIndex];

        uint nftCount = 0; // Counter for NFTs earned

        // Check if the final score is higher than the current highest score
        if (finalScore > player.highestScore) {
            uint previousHighScore = player.highestScore;
            player.highestScore = finalScore;
            emit HighestScoreUpdated(msg.sender, finalScore);

            // Reward NFTs for reaching new milestones
            for (uint i = 0; i < scoreMilestones.length; i++) {
                if (finalScore >= scoreMilestones[i] && previousHighScore < scoreMilestones[i]) {
                    // Mint NFT as a reward
                    uint tokenId = mintNFTReward(msg.sender, scoreMilestones[i]);
                    emit NFTRewarded(msg.sender, tokenId, scoreMilestones[i]);
                    nftCount++; // Increment NFT count
                }
            }
        }
        return nftCount;
    }

    // Mint NFT as a reward for reaching a milestone
    function mintNFTReward(address player, uint milestone) internal returns (uint) {
        // Generate a unique token ID (e.g., milestone + player address)
        require(player != address(0), "Invalid player address");
        require(milestone > 0, "Milestone must be greater than 0");
        uint tokenId = uint(keccak256(abi.encodePacked(player, milestone)));
        string memory tokenURI = getTokenURIForMilestone(milestone); // Fetch IPFS URI for the milestone
        carSkinNFT.safeMint(player, tokenURI); // Mint the NFT

        // Add the token ID to the player's list of owned skins
        playerSkins[player].push(tokenId);

        return tokenId;
    }

    // Get IPFS URI for a milestone (replace with your logic)
    function getTokenURIForMilestone(uint milestone) internal pure returns (string memory) {
        if (milestone == 100) return "https://ipfs.io/ipfs/Qmay4uxsALQMYeB24AppfCP6unevsyZRkw17vLm3tmPzXN";
        if (milestone == 500) return "https://ipfs.io/ipfs/QmZBeUGTenuZXWfJwWdt7FZfLJqqVQq6C2wWqzFTvm1fqh";
        if (milestone == 1000) return "https://ipfs.io/ipfs/QmYkHBd8RQU48QX3W1g6GPijumrZvVBZzJTkkKJnRpAECB";
        if (milestone == 2000) return "https://ipfs.io/ipfs/QmT4fxrE1AKCbtjPLRnCHUjesB3FpP3daM8czMGDfjZGuG";
        if (milestone == 5000) return "https://ipfs.io/ipfs/Qmcbxq2Yz24WmEuWzx8EBrcuEAbmBXm8HqcyVvka6wkvCr";
        return "";
    }

    // Get a player's index in the listOfPlayers array
    function getPlayerIndex(address playerAddress) internal view returns (uint) {
        require(playerToIndex[playerAddress] != 0 || listOfPlayers[0].player == playerAddress, "Player not found");
        return playerToIndex[playerAddress];
    }

    // Get all players (for leaderboard)
    function getAllPlayers() public view returns (Player[] memory) {
        return listOfPlayers;
    }

    // Get a player's selected skin token ID
    function getSelectedSkin(address playerAddress) public view returns (uint) {
        return listOfPlayers[getPlayerIndex(playerAddress)].selectedSkin;
    }

    // Get a player's highest score
    function getHighestScore(address playerAddress) public view returns (uint) {
        return listOfPlayers[getPlayerIndex(playerAddress)].highestScore;
    }

    // Get a player's owned skins
    function getPlayerSkins(address playerAddress) public view returns (uint[] memory) {
        return playerSkins[playerAddress];
    }
}