import { isNewHighScore,mintNFT,latestScore } from './app.js';

import Phaser from 'phaser';
import TitleScreen from './titlescreen.js';
import CarSelectionScreen from './carSelectionScreen.js';
import crash from './assets/crash.mp3'


import myImageUrl from './assets/Roads/road1.png';
import myImageUrl2 from './assets/Roads/road2.png';
import myImageUrl3 from './assets/Roads/road3.png';
import myImageUrl4 from './assets/Roads/road4.png';
import carImage from './assets/Cars/cars1.png';
import obstacleCar1 from './assets/Cars/traffic (1).png';
import obstacleCar2 from './assets/Cars/traffic (2).png';
import obstacleCar3 from './assets/Cars/traffic (3).png';
import obstacleCar4 from './assets/Cars/traffic (4).png';
import speedup  from './assets/Cars/speedup.jpg';
import speeddown  from './assets/Cars/speeddown.jpg';

class MainGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainGameScene' });
    }

    preload() {
        this.load.image('road1', myImageUrl);
        this.load.image('road2', myImageUrl2);
        this.load.image('road3', myImageUrl3);
        this.load.image('road4', myImageUrl4);

        this.load.image('car1', carImage);  // Load all cars
        this.load.image('car2', 'assets/Cars/cars2.png');

        this.load.image("obstacle1", obstacleCar1);
        this.load.image("obstacle2", obstacleCar2);
        this.load.image("obstacle3", obstacleCar3);
        this.load.image("obstacle4", obstacleCar4);
    }

    create() {
        this.score = 0; // Initialize score

        let selectedCar = localStorage.getItem('selectedCar') || 'car1';  // Get selected car or default to car1

        this.Roads = this.add.tileSprite(0, 0, 720, 750, 'road1').setOrigin(0, 0);
        this.Roads.setScale(3);

        this.playerCar = this.physics.add.sprite(360, 600, selectedCar).setScale(2);
        this.playerCar.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.obstacles = this.physics.add.group();

        let userId = localStorage.getItem("userId") || "Guest";
        this.add.text(20, 60, `User: ${userId}`, { fontSize: '24px', fill: '#fff' });

        this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, { fontSize: '32px', fill: '#fff' });

    
        
        
            
        

        // Spawn obstacles and check for collision
        this.time.addEvent({
            delay: 3000,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });


        this.physics.add.overlap(this.playerCar, this.obstacles, this.gameOver, null, this);
        
    }

    update() {
        
        this.Roads.tilePositionY -= 2;  // Move the road background

        this.playerCar.setVelocityX(0);

        if (this.cursors.left.isDown) this.playerCar.setVelocityX(-500);
        if (this.cursors.right.isDown) this.playerCar.setVelocityX(500);

        // Clamp player car's X position to prevent it from going off-road
        this.playerCar.x = Phaser.Math.Clamp(this.playerCar.x, 110, 600);
    }
    

    spawnObstacle() {
        let lanes = [150, 290, 430, 570];
        Phaser.Utils.Array.Shuffle(lanes); // Shuffle lanes for random spawning
    
        let numObstacles = Phaser.Math.Between(1, 2);  // Start with 1 or 2 obstacles
    
        // Adjust obstacle spawning based on score
        if (this.score >= 50) {
            // Increase chances of 3 obstacles spawning
            numObstacles = Phaser.Math.Between(2, 3);
        }
    
        for (let i = 0; i < numObstacles; i++) {
            this.time.addEvent({
                delay: i * 400,  // Stagger obstacle spawn
                callback: () => {
                    let xPosition = lanes[i];
                    let obstacleType = Phaser.Math.Between(1, 4);  // Initially spawn only car types 1 and 2
                    let obstacle = this.obstacles.create(xPosition, -50, `obstacle${obstacleType}`).setScale(2);
                    obstacle.setVelocityY(200 + (this.score / 10));  // Increase speed based on score
                    obstacle.setActive(true);
                    obstacle.setVisible(true);
                    obstacle.body.setAllowGravity(false);
    
                    // Remove obstacle after 5 seconds
                    this.time.addEvent({
                        delay: 6000,
                        callback: () => {
                            obstacle.destroy();
                            this.score += 4;  // Increase score when an obstacle is avoided
                            this.scoreText.setText(`Score: ${this.score}`);
                        },
                        callbackScope: this
                    });
                },
                callbackScope: this
            });
        }
    }

      
    
        async gameOver() {
            this.game.pause();
            let crash_sound = new Audio(crash)
            crash_sound.play();
            
            try {
                // Update latest score and wait for confirmation
                const scoreTransaction = await latestScore(this.score);
                console.log("Updating score...");
                await scoreTransaction.wait();
                console.log("Score updated successfully");
                
                // Check if it's a high score
                const isHighScoreResult = await isNewHighScore(this.score);
                console.log("Checking if high score...");
                
                if (isHighScoreResult) {
                    console.log("New high score! Minting NFT...");
                    await mintNFT();
                    alert("Congratulations! You got a new high score!");
                } else {
                    alert("You did not beat the high score");
                }
            } catch (error) {
                console.error("Error in game over:", error);
                alert("Error processing score: " + error.message);
            } finally {
                location.reload();
            }
        }
    
    
  
}




// Phaser Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 720,
    height: 750,
    scale: {
        mode: Phaser.Scale.FIT, // Auto-resize to fit the screen
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: [TitleScreen, CarSelectionScreen, MainGameScene]  // Ensure all scenes are included
};

const game = new Phaser.Game(config);