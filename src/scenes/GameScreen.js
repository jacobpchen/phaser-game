import Phaser from 'phaser'
import WebFontFile from './WebFontFile'
import { GameBackground } from '../consts/SceneKeys'
import * as Colors from '../consts/Colors'

export default class Game extends Phaser.Scene {

    init() {
        this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0)

        this.leftScore = 0
        this.rightScore = 0

        this.pause = false



    }

    preload() {
        const fonts = new WebFontFile(this.load, 'Press Start 2P')
        this.load.addFile(fonts)
    }

    create() {
        this.scene.run(GameBackground)
        this.scene.sendToBack(GameBackground)

        this.physics.world.setBounds(-100, 0, 1000, 500)

        this.ball = this.add.circle(400, 250, 10, Colors.White, 1)
        this.physics.add.existing(this.ball)
        this.ball.body.setCircle(10)
        this.ball.body.setBounce(1, 1)

        this.ball.body.setCollideWorldBounds(true, 1, 1)

        // Create a left paddle
        this.paddleLeft = this.add.rectangle(50, 250, 30, 100, Colors.White, 1)
        this.physics.add.existing(this.paddleLeft, true)
        // Create a right paddle
        this.paddleRight = this.add.rectangle(750, 250, 30, 100, Colors.White, 1)
        this.physics.add.existing(this.paddleRight, true)

        // Add collision detection
        this.physics.add.collider(this.ball, this.paddleLeft)
        this.physics.add.collider(this.ball, this.paddleRight)

        // scores
        const scoreStyle = {
            fontSize: 40,
            fontFamily: '"Press Start 2P"'
        }

        this.leftScoreLabel = this.add.text(300, 50, '0', scoreStyle)
            .setOrigin(0.5, 0.5)

        this.rightScoreLabel = this.add.text(500, 50, '0', scoreStyle)
            .setOrigin(0.5, 0.5)

        this.cursors = this.input.keyboard.createCursorKeys()

        this.time.delayedCall(1500, () => {
            this.resetBall()
        })
    }
    update() {
        if (this.pause) {
            return
        }
        this.processPlayerInput()
        this.updateAI()
        this.checkScore()

    }

    checkScore() {
        const x = this.ball.x
        const leftBounds = -30
        const rightBounds = 830
        if (x >= leftBounds && x <= rightBounds) {
            return
        }

        // When the ball goes out of bounds reset
        if (this.ball.x < leftBounds) {
            // score for right
            this.incrementRightScore()

        }
        else if (this.ball.x > rightBounds) {
            // score for left
            this.incrementLeftScore
        }

        // game end
        const maxScore = 1
        if (this.leftScore >= maxScore) {
            // player wins
            console.log("Player won")
            this.pause = true
        }
        else if (this.rightScore >= maxScore) {
            // ai wins
            console.log("AI won")
            this.pause = true
        }

        if (!this.pause) {
            this.resetBall()
        } else {
            this.ball.active = false
            this.physics.world.remove(this.ball.body)
        }

    }

    processPlayerInput() {
        /** @ type {Phase.Physics.Arcade.StaticBody} */
        const body = this.paddleLeft.body
        if (this.cursors.up.isDown) {
            this.paddleLeft.y -= 10
            body.updateFromGameObject()
        }
        else if (this.cursors.down.isDown) {
            this.paddleLeft.y += 10
            body.updateFromGameObject()
        }

    }

    updateAI() {
        // AI paddle
        const diff = this.ball.y - this.paddleRight.y
        if (Math.abs(diff) < 10) {
            return
        }

        const aiSpeed = 3

        // if the ball is above the paddle
        if (diff < 0) {
            this.paddleRightVelocity.y = -aiSpeed
            if (this.paddleRightVelocity < -10)
                this.paddleRightVelocity = -10
        }
        // ball is below the paddle
        else if (diff > 0) {
            this.paddleRightVelocity.y = aiSpeed
            if (this.paddleRightVelocity < 10)
                this.paddleRightVelocity = 10
        }

        this.paddleRight.y += this.paddleRightVelocity.y
        this.paddleRight.body.updateFromGameObject()
    }

    resetBall() {
        // pick and angle and convert it to a vector
        this.ball.setPosition(400, 250)
        const angle = Phaser.Math.Between(0, 360)
        const vec = this.physics.velocityFromAngle(angle, 200)

        this.ball.body.setVelocity(vec.x, vec.y)
    }

    incrementLeftScore() {
        this.leftScore += 1
        this.leftScoreLabel.text = this.leftScore
    }

    incrementRightScore() {
        this.rightScore += 1
        this.rightScoreLabel.text = this.rightScore
    }



}