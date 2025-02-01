import Phaser from 'phaser';


// import {Skin} from "./app.js";
// Import car images
import carImage1 from './assets/Cars/cars1.png';
import carImage2 from './assets/Cars/cars2.png';
import carImage3 from './assets/Cars/cars3.png';
import carImage4 from './assets/Cars/cars4.png';
import carImage5 from './assets/Cars/cars7.png';
import carImage6 from './assets/Cars/cars8.png';

export default class CarSelectionScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'CarSelectionScreen' });
    }

    preload() {
        // Load car images for selection
        this.load.image('car1', carImage1);
        this.load.image('car2', carImage2);
        this.load.image('car3', carImage3);
        this.load.image('car4', carImage4);
        this.load.image('car7', carImage5);
        this.load.image('car8', carImage6);
         
    }

    create() {
        this.add.text(400, 100, 'Select Your Car', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Display each car and make them interactive
        let cars = [
            { key: 'car1', x: 150 },
            { key: 'car2', x: 250 },
            { key: 'car3', x: 350 },
            { key: 'car4', x: 450 },
            { key: 'car7', x: 550 },
            { key: 'car8', x: 650 },
        
        ];

        // cars.forEach(car => {
        //     let selectedCar;
        //     let carImage = this.add.image(car.x, 300, car.key).setScale(2).setInteractive();
        //     carImage.on('pointerdown', () => selectedCar = car.tokenid);
        //     if (Skin(selectedCar)){
        //         this.startGame(car.key);
        //     }
        //     else {
        //         alert("You do not own this car")
        //     }
        // });

        cars.forEach(car => {
            let carImage = this.add.image(car.x, 300, car.key).setScale(2).setInteractive();
            carImage.on('pointerdown', () => this.startGame(car.key));
        });

    }

    startGame(selectedCar) {
        localStorage.setItem('selectedCar', selectedCar);  // Store the selection
        this.scene.start('MainGameScene');
    }
}
