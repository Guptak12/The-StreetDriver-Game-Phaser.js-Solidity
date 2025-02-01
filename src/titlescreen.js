import Phaser from 'phaser';
import backgroundImage from './endlessgame.jpeg';


import { submitPlayerData,connectWallet } from './app'; 
export default class TitleScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScreen' });
    }

    async PlayerData(name){
        alert("Adding player to blockchain...");
        submitPlayerData(name);

    }

    preload() {
        this.load.image('background', backgroundImage);
    }

    create() {
        // Add background
        this.add.image(360, 375, 'background').setOrigin(0.5).setScale(3);

        // Add title text
        this.add.text(360, 100, 'Endless Car Game', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        // Create input fields below the image
        this.createInputFields();

        // Create Connect MetaMask button
        // this.createMetaMaskButton();

        // Create Submit Button
        this.createSubmitButton();
    }

    createInputFields() {
        // Create username input
        this.usernameInput = document.createElement('input');
        this.usernameInput.type = 'text';
        this.usernameInput.placeholder = 'Enter Username';
        this.usernameInput.style.position = 'absolute';
        this.usernameInput.style.left = '50%';
        this.usernameInput.style.top = '450px';  // Below image
        this.usernameInput.style.width = '200px';
        this.usernameInput.style.height = '30px';
        this.usernameInput.style.fontSize = '18px';
        this.usernameInput.style.textAlign = 'center';
        this.usernameInput.style.transform = 'translateX(-50%)';
        document.body.appendChild(this.usernameInput);

        // Handle Enter key press to move to MetaMask button
        this.usernameInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const username = this.usernameInput.value.trim();
                connectWallet();
        this.PlayerData(username);
        if (username === '' || !wallet) {
            alert('Please enter username and connect MetaMask!');
            return;
        }

        // Store in local storage
        // localStorage.setItem('userId', username);

        // Remove input fields after submission
        document.body.removeChild(this.usernameInput);
        // document.body.removeChild(this.metaMaskButton);

        // Start car selection screen
        this.scene.start('CarSelectionScreen');
                // this.connectMetaMask(); // Try connecting MetaMask after username input
            }
        });
    }

    // async connectMetaMask() {
    //     connectWallet();
    // }
    // createMetaMaskButton() {
    //     // Create Connect MetaMask Button
    //     this.metaMaskButton = document.createElement('button');
    //     this.metaMaskButton.innerText = 'Connect MetaMask';
    //     this.metaMaskButton.style.position = 'absolute';
    //     this.metaMaskButton.style.left = '50%';
    //     this.metaMaskButton.style.top = '500px';  // Below username input
    //     this.metaMaskButton.style.width = '200px';
    //     this.metaMaskButton.style.height = '40px';
    //     this.metaMaskButton.style.fontSize = '18px';
    //     this.metaMaskButton.style.transform = 'translateX(-50%)';
    //     this.metaMaskButton.style.cursor = 'pointer';
    //     document.body.appendChild(this.metaMaskButton);

    //     // Connect to MetaMask on click
    //     this.metaMaskButton.addEventListener('click', () => this.connectMetaMask());
    // }

    // async connectMetaMask() {
    //     if (window.ethereum) {
    //         try {
    //             const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //             const walletAddress = accounts[0];
    //             alert(walletAddress);
    //             // Store in local storage
    //             localStorage.setItem('wallet', walletAddress);

    //             // Update button text to show wallet address
    //             this.metaMaskButton.innerText = `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    //             this.metaMaskButton.disabled = true;

    //         } catch (error) {
    //             alert('MetaMask connection failed. Please try again.');
    //             console.error(error);
    //         }
    //     } else {
    //         alert('MetaMask not found. Please install MetaMask.');
    //     }
    // }

    createSubmitButton() {
        // Create Submit Button
        this.submitButton = this.add.text(360, 580, 'Submit', { fontSize: '32px', fill: '#0f0' })
            .setOrigin(0.5)
            .setInteractive();
        
        // On button click, save inputs and start the next scene
        this.submitButton.on('pointerdown', this.submitForm, this);
    }

    submitForm() {
        const username = this.usernameInput.value.trim();
        const wallet = localStorage.getItem('wallet'); // Get MetaMask wallet address
        this.PlayerData(username);
        connectWallet();
        if (username === '' || !wallet) {
            alert('Please enter username and connect MetaMask!');
            return;
        }

        // Store in local storage
        localStorage.setItem('userId', username);

        // Remove input fields after submission
        document.body.removeChild(this.usernameInput);
        // document.body.removeChild(this.metaMaskButton);


        // Start car selection screen
        this.scene.start('CarSelectionScreen');
    }

    
}
