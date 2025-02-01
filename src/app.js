import { ethers } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
// import _abi from "./abi.json";

const contract_address = "0x02Ca14e01dCf20e9798a6606183306d71544cd68";

// ABI of the smart contract
const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "addPerson",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_nftContractAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newHighestScore",
				"type": "uint256"
			}
		],
		"name": "HighestScoreUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newLatestScore",
				"type": "uint256"
			}
		],
		"name": "LatestScoreUpdated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "mintEligibleNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "milestone",
				"type": "uint256"
			}
		],
		"name": "NFTRewarded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "ign",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "PlayerRegistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "selectSkin",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "SkinSelected",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "finalScore",
				"type": "uint256"
			}
		],
		"name": "updateLatestScore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "carSkinNFT",
		"outputs": [
			{
				"internalType": "contract CarSkinNFT",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllPlayers",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "ign",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "player",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "highestScore",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "selectedSkin",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "latestScore",
						"type": "uint256"
					}
				],
				"internalType": "struct CarGame.Player[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "playerAddress",
				"type": "address"
			}
		],
		"name": "getHighestScore",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "playerAddress",
				"type": "address"
			}
		],
		"name": "getPlayerSkins",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "playerAddress",
				"type": "address"
			}
		],
		"name": "getSelectedSkin",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "latestScore",
				"type": "uint256"
			}
		],
		"name": "isNewHighScore",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "scoreMilestones",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

let contract =null;
let signer=null;
let provider=null;
export async function connectWallet() {
    if (window.ethereum == null) {
        console.log("MetaMask not installed; using read-only defaults");
        provider = ethers.getDefaultProvider();
        signer = null;
    } else {
        provider = new ethers.BrowserProvider(window.ethereum);

        try {
            signer = await provider.getSigner(); // Request user connection
            contract = new ethers.Contract(contract_address, abi, signer);
            console.log("Wallet connected, contract initialized:", contract);
        } catch (error) {
            if (error.code === 4001) {
                alert("You rejected the connection request. Please approve it in MetaMask.");
            } else {
                console.error("Error connecting wallet:", error);
            }
        }
    }
}

// Ensure contract is initialized before using it
async function ensureContract() {
    if (!contract) {
        await connectWallet();
    }
}

// Updated function to add a player
export async function submitPlayerData(playerName) {
    await ensureContract();
    const tx = await contract.addPerson(playerName);
    await tx.wait();
    alert("Player added to blockchain!");
}

export async function Skin(tokenId) {
    await ensureContract();
    const tx = await contract.selectSkin(tokenId);
    await tx.wait();
    alert("Skin selected successfully!");
    
}

export async function latestScore(finalscore) {
    await ensureContract();
    
    const tx = await contract.updateLatestScore(finalscore);
    await tx.wait();
    alert("Latest score updated!");
    return tx;
}

export async function isNewHighScore(latestScore) {
    await ensureContract();
    const tx = await contract.isNewHighScore(latestScore);
    return tx;
    // await tx.wait();

    
    
}

export async function mintNFT() {
    await ensureContract();
    try {
        console.log("Starting NFT mint...");
        const tx = await contract.mintEligibleNFT();
        console.log("Mint transaction:", tx);
        await tx.wait();
        console.log("NFT minted successfully!");
        alert("NFT minted successfully!");
    } catch (error) {
        console.error("Error minting NFT:", error);
        alert("Error minting NFT: " + error.message);
    }
}

export async function getPlayers() {
    await ensureContract();
    try {
        const players = await contract.getAllPlayers();
        return players;
    } catch (error) {
        console.error("Error fetching players:", error);
        return [];
    }
}