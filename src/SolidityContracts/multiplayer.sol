// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MultiplayerCarGame {
    struct Lobby {
        uint lobbyId;
        address[] players; // List of players in the lobby
        mapping(address => uint) playerScores; // Player address to their final score
        bool isActive; // Whether the lobby is active
        bool isGameStarted; // Whether the game has started
        address winner; // Address of the winner
    }

    uint public lobbyCounter; // Counter for lobby IDs
    mapping(uint => Lobby) public lobbies; // Lobby ID to Lobby struct

    // Events
    event LobbyCreated(uint lobbyId, address creator);
    event PlayerJoined(uint lobbyId, address player);
    event LobbyStarted(uint lobbyId);
    event LobbyEnded(uint lobbyId, address winner);

    // Create a new lobby
    function createLobby() public {
        lobbyCounter++;
        Lobby storage newLobby = lobbies[lobbyCounter];
        newLobby.lobbyId = lobbyCounter;
        newLobby.players.push(msg.sender); // Creator joins the lobby
        newLobby.isActive = true;

        // Emit the lobby ID so the creator can view it
        emit LobbyCreated(lobbyCounter, msg.sender);
    }

    // Join an existing lobby
    function joinLobby(uint lobbyId) public {
        require(lobbies[lobbyId].isActive, "Lobby is not active");
        require(lobbies[lobbyId].players.length < 5, "Lobby is full");
        require(!isPlayerInLobby(lobbyId, msg.sender), "Player already in lobby");

        lobbies[lobbyId].players.push(msg.sender);
        emit PlayerJoined(lobbyId, msg.sender);
    }

    // Start the game in the lobby (only the creator can start)
    function startLobby(uint lobbyId) public {
        require(lobbies[lobbyId].players[0] == msg.sender, "Only the lobby creator can start the game");
        require(lobbies[lobbyId].players.length >= 2, "At least 2 players are required to start the game");
        require(!lobbies[lobbyId].isGameStarted, "Game has already started");
        lobbies[lobbyId].isGameStarted = true;
        emit LobbyStarted(lobbyId);
    }

    // Retrieve scores of all players in the lobby
    function retrieveScores(uint lobbyId) public view returns (address[] memory, uint[] memory) {
        require(lobbies[lobbyId].isGameStarted, "Game has not started yet");

        address[] memory players = lobbies[lobbyId].players;
        uint[] memory scores = new uint[](players.length);

        for (uint i = 0; i < players.length; i++) {
            scores[i] = lobbies[lobbyId].playerScores[players[i]];
        }

        return (players, scores);
    }

    // End the lobby and determine the winner
    function endLobby(uint lobbyId) public {
        require(lobbies[lobbyId].isActive, "Lobby is not active");
        require(lobbies[lobbyId].isGameStarted, "Game has not started yet");

        address winner = determineWinner(lobbyId);
        lobbies[lobbyId].winner = winner;
        lobbies[lobbyId].isActive = false;

        emit LobbyEnded(lobbyId, winner);
    }
    function submitScore(uint lobbyId, uint finalScore) public {
        require(lobbies[lobbyId].isActive, "Lobby is not active");
        require(lobbies[lobbyId].isGameStarted, "Game has not started yet");
        require(isPlayerInLobby(lobbyId, msg.sender), "Player not in lobby");

        lobbies[lobbyId].playerScores[msg.sender] = finalScore;
    }
    // Determine the winner of the lobby
    function determineWinner(uint lobbyId) internal view returns (address) {
        address[] memory players = lobbies[lobbyId].players;
        address winner = players[0];
        uint highestScore = lobbies[lobbyId].playerScores[winner];

        for (uint i = 1; i < players.length; i++) {
            if (lobbies[lobbyId].playerScores[players[i]] > highestScore) {
                winner = players[i];
                highestScore = lobbies[lobbyId].playerScores[players[i]];
            }
        }

        return winner;
    }

    // Check if a player is in a lobby
    function isPlayerInLobby(uint lobbyId, address player) internal view returns (bool) {
        for (uint i = 0; i < lobbies[lobbyId].players.length; i++) {
            if (lobbies[lobbyId].players[i] == player) {
                return true;
            }
        }
        return false;
    }

    // Get players in a lobby
    function getPlayersInLobby(uint lobbyId) public view returns (address[] memory) {
        return lobbies[lobbyId].players;
    }

    // Get the winner of a lobby
    function getLobbyWinner(uint lobbyId) public view returns (address) {
        return lobbies[lobbyId].winner;
    }
}