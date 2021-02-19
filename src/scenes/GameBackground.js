import Phaser from 'phase'

export default class GameBackground extends Phaser.Scene {
    preload() {

    }

    create() {
        this.add.line(400, 250, 400, 0, 500, 0xffffff, 1)
    }
}