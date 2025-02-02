import Phaser from 'phaser';
import backgroundImage from './background1.jpg';


import { submitPlayerData,connectWallet } from './app'; 
export default class TitleScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScreen' });
    }

    // async PlayerData(name){
    //     alert("Adding player to blockchain...");
    //     submitPlayerData(name);

    // }

    preload() {
        this.load.image('background', backgroundImage);
    }

    create() {
        // Add background
        this.add.image(720, 750, 'background').setOrigin(0.5).setScale(3);

        // Add title text
        this.add.text(300, 85, 'Endless Car Game', { fontSize: '48px', fill: '#000' }).setOrigin(0.5);

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
        const wallet = localStorage.getItem('wallet'); // Get MetaMask wallet address
        submitPlayerData(username);
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
        });
    }
    // joinlobby(){
    //     // create the lobby 
    //     this.joinlobby = this.add.text(360, 400, 'Join Lobby', { fontSize: '32px', fill: '#000' })
    //         .setOrigin(0.5)
    //         .setInteractive();
    //     this.joinlobby.on('pointerdown', this.joinlobby, this);
    // }
    // joinlobby(){
    
    // }

 
    createSubmitButton() {
        // Create Submit Button
        this.submitButton = this.add.text(360, 580, 'Submit', { fontSize: '32px', fill: '#000' })
            .setOrigin(0.5)
            .setInteractive();
        
        // On button click, save inputs and start the next scene
        this.submitButton.on('pointerdown', this.submitForm, this);
    }

    submitForm() {
        const username = this.usernameInput.value.trim();
        const wallet = localStorage.getItem('wallet'); // Get MetaMask wallet address
        submitPlayerData(username);
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
