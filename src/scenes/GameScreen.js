import Phaser from 'phaser'

export default class Game extends Phaser.Scene {

    init() {
        this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0)
    }



    preload() {


    }

    create() {

        this.ball = this.add.circle(400, 250, 10, 0xffffff, 1)
        this.physics.add.existing(this.ball)
        this.ball.body.setBounce(1, 1)

        this.ball.body.setCollideWorldBounds(true, 1, 1)

        this.ball.body.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200))

        this.paddleLeft = this.add.rectangle(50, 250, 30, 100, 0xffffff, 1)
        this.physics.add.existing(this.paddleLeft, true)

        this.paddleRight = this.add.rectangle(750, 250, 30, 100, 0xffffff, 1)
        this.physics.add.existing(this.paddleRight, true)

        this.physics.add.collider(this.ball, this.paddleLeft)
        this.physics.add.collider(this.ball, this.paddleRight)

        this.cursors = this.input.keyboard.createCursorKeys()
    }
    update() {
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
}