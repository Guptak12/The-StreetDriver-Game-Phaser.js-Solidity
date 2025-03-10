import Phaser from 'phaser';
import backgroundImage from './background1.jpg';

import { submitPlayerData, connectWallet } from './app';

export default class TitleScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScreen' });
    }

    preload() {
        this.load.image('background', backgroundImage);
    }

    create() {
        // Add background
        this.add.image(720, 750, 'background').setOrigin(0.5).setScale(3);

        // Add title text
        this.add.text(300, 85, 'Endless Car Game', { fontSize: '48px', fontFamily: 'Arial Black', fill: '#000' }).setOrigin(0.5);

        // Create input field UI
        this.createInputField();

        // Create Game Start Button
        this.createGameStartButton();
    }

    createInputField() {
        const inputX = 360;
        const inputY = 450;
        const inputWidth = 300;
        const inputHeight = 50;
        const borderRadius = 25; // Rounded corners

        // Create a Phaser graphics object for a rounded rectangle (input box)
        const inputBox = this.add.graphics();
        inputBox.fillStyle(0xffffff, 1); // White background
        inputBox.fillRoundedRect(inputX - inputWidth / 2, inputY - inputHeight / 2, inputWidth, inputHeight, borderRadius);
        inputBox.lineStyle(4, 0x000000, 1); // Black border
        inputBox.strokeRoundedRect(inputX - inputWidth / 2, inputY - inputHeight / 2, inputWidth, inputHeight, borderRadius);

        // Create a floating HTML input field with better styling
        this.usernameInput = document.createElement('input');
        this.usernameInput.type = 'text';
        this.usernameInput.placeholder = 'Enter Username';
        this.usernameInput.style.position = 'absolute';
        this.usernameInput.style.left = '50%';
        this.usernameInput.style.top = '430px';
        this.usernameInput.style.width = '280px';
        this.usernameInput.style.height = '40px';
        this.usernameInput.style.fontSize = '20px';
        this.usernameInput.style.borderRadius = '20px';
        this.usernameInput.style.border = '2px solid black';
        this.usernameInput.style.padding = '5px';
        this.usernameInput.style.textAlign = 'center';
        this.usernameInput.style.backgroundColor = '#f5f5f5';
        this.usernameInput.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)';
        this.usernameInput.style.transform = 'translateX(-50%)';
        document.body.appendChild(this.usernameInput);

        // Handle Enter key press
        this.usernameInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.startGame();
            }
        });
    }

    createGameStartButton() {
        const buttonX = 360;
        const buttonY = 580;
        const buttonWidth = 220;
        const buttonHeight = 60;
        const borderRadius = 30; // Rounded corners

        // Create a graphics object for the button
        const buttonGraphics = this.add.graphics();
        buttonGraphics.fillStyle(0x333333, 1); // Grey fill
        buttonGraphics.fillRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, borderRadius);
        buttonGraphics.lineStyle(4, 0x000000, 1); // Black border
        buttonGraphics.strokeRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, borderRadius);

        // Add button text
        const buttonText = this.add.text(buttonX, buttonY, 'Game Start', { fontSize: '32px', fill: '#ffffff', fontFamily: 'Arial Black' })
            .setOrigin(0.5);

        // Make it interactive
        buttonGraphics.setInteractive(new Phaser.Geom.Rectangle(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

        // Add hover and click effects
        buttonGraphics.on('pointerover', () => {
            buttonGraphics.clear();
            buttonGraphics.fillStyle(0x000000, 1); // Black on hover
            buttonGraphics.fillRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, borderRadius);
            buttonGraphics.strokeRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, borderRadius);
        });

        buttonGraphics.on('pointerout', () => {
            buttonGraphics.clear();
            buttonGraphics.fillStyle(0x333333, 1); // Grey default
            buttonGraphics.fillRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, borderRadius);
            buttonGraphics.strokeRoundedRect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, borderRadius);
        });

        buttonGraphics.on('pointerdown', () => {
            this.startGame();
        });
    }

    startGame() {
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

        // Start car selection screen
        this.scene.start('CarSelectionScreen');
    }
}