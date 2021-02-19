import Phaser from 'phaser'
import { Game } from '../consts/SceneKeys'
export default class TitleScreen extends Phaser.Scene {
    preload() {

    }

    create() {
        const title = this.add.text(400, 200, 'Totally Not Pong', {
            fontSize: 50,
            fontFamily: '"Press Start 2P"'
        })
        title.setOrigin(0.5, 0.5)

        this.add.text(400, 300, 'Press Space to Start', {
            fontFamily: "'Press Start 2P'"
        }).setOrigin(0.5)

        this.input.keyboard.once(`keydown-SPACE`, () => {
            this.scene.start(Game)
        })


    }
}