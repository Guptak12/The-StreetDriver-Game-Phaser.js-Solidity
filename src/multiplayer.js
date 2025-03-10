import { ethers } from "ethers";

const contract_address="";
abi =[
	{
		"inputs": [],
		"name": "createLobby",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "lobbyId",
				"type": "uint256"
			}
		],
		"name": "endLobby",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "lobbyId",
				"type": "uint256"
			}
		],
		"name": "joinLobby",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "lobbyId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			}
		],
		"name": "LobbyCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "lobbyId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			}
		],
		"name": "LobbyEnded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "lobbyId",
				"type": "uint256"
			}
		],
		"name": "LobbyStarted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "lobbyId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "PlayerJoined",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "lobbyId",
				"type": "uint256"
			}
		],
		"name": "startLobby",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "lobbyId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "finalScore",
				"type": "uint256"
			}
		],
		"name": "submitScore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "lobbyId",
				"type": "uint256"
			}
		],
		"name": "getLobbyWinner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "lobbyId",
				"type": "uint256"
			}
		],
		"name": "getPlayersInLobby",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
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
		"name": "lobbies",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "lobbyId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "isGameStarted",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "winner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lobbyCounter",
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
				"name": "lobbyId",
				"type": "uint256"
			}
		],
		"name": "retrieveScores",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export async function connectMWallet() {
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


export async function createLobby() {
    try {
        const tx = await contract.createLobby();
        await tx.wait();

        // Listen for the LobbyCreated event
        contract.on("LobbyCreated", (lobbyId, creator) => {
            if (creator ===  signer.getAddress()) {
                // console.log(Lobby created! Lobby ID: ${lobbyId});
                // Display the lobby ID to the user
               alert("Lobby created! Lobby ID: " + lobbyId);
            }
        });
    } catch (error) {
        console.error("Error creating lobby:", error);
    }
}

export async function joinLobby() {
    const lobbyId = document.getElementById("lobbyIdInput").value;

    try {
        const tx = await contract.joinLobby(lobbyId);
        await tx.wait();
        console.log("Joined lobby!");
    } catch (error) {
        console.error("Error joining lobby:", error);
    }
}

export async function startLobby() {
    const lobbyId = document.getElementById("lobbyIdInput").value;

    try {
        const tx = await contract.startLobby(lobbyId);
        await tx.wait();
        console.log("Game started!");
    } catch (error) {
        console.error("Error starting lobby:", error);
    }
}

export async function submitScore(lobbyId, finalScore) {
    try {
        const tx = await contract.submitScore(lobbyId, finalScore);
        await tx.wait();
        console.log("Score submitted!");
    } catch (error) {
        console.error("Error submitting score:", error);
    }
}

export async function retrieveScoresAndDetermineWinner(lobbyId) {
    try {
        const [players, scores] = await contract.retrieveScores(lobbyId);

        // Determine the winner
        let winner = players[0];
        let highestScore = scores[0];

        for (let i = 1; i < players.length; i++) {
            if (scores[i] > highestScore) {
                winner = players[i];
                highestScore = scores[i];
            }
        }
        alert("Winner: " + winner + " (Score: " + highestScore + ")");
        
    } catch (error) {
        console.error("Error retrieving scores:", error);
    }
}