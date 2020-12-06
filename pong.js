const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
let ball,
    player1,
    player2,
    playersRight,
    savedPlayers,
    trainingQuantity,
    generation,
    previousBest,
    trainedBrain,
    trainedBrain2,
    training,
    lastPoints,
    AIvsAI

let pause = false

class Ball {
    constructor() {
        this.x = getRandomInt((canvas.width / 2) - 50, (canvas.width / 2) + 50)
        this.y = getRandomInt((canvas.height / 2) - 50, (canvas.height / 2) + 50)
        this.radius = 10
        this.velocityY = getRandomInt(5, 7)
        this.velocityX = -(getRandomInt(5, 7))
    }

    draw() {
        this.detectCollision()
        context.fillStyle = 'white'
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        context.fill()
    }

    detectCollision() {
        //Player1
        if (this.x - this.radius <= player1.x) {
            if (this.y + this.radius >= player1.y && this.y + this.radius <= player1.y + player1.height) {
                player1.points++
                this.velocityX = -this.velocityX
                this.x = this.radius
            } else {
                game.gameOver(1)
            }
        }

        //Player2
        if (training) {
            let collision = false

            playersRight.forEach((player, index) => {
                if (this.x - this.radius >= player.x - player.width) {
                    if (this.y + this.radius >= player.y && this.y + this.radius <= player.y + player.height) {
                        player.points++
                        collision = true
                    } else {
                        savedPlayers.push(player)
                        playersRight.splice(index, 1)
                    }
                }
            })

            if (collision) {
                this.velocityX = -this.velocityX
                this.x = canvas.width - this.radius
            }
        } else {
            if (this.x - this.radius >= player2.x) {
                if (this.y + this.radius >= player2.y && this.y + this.radius <= player2.y + player2.height) {
                    player2.points++
                    this.velocityX = -this.velocityX
                    this.x = canvas.width - this.radius
                } else {
                    game.gameOver(0)
                }
            }
        }

        if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0)
            this.velocityY = -this.velocityY

        if (getCurrentBestPlayer()) {
            if (getCurrentBestPlayer().points >= 10 && getCurrentBestPlayer().points % 10 === 0 && getCurrentBestPlayer().points != lastPoints) {
                lastPoints = getCurrentBestPlayer().points
                this.velocityY += this.velocityY > 0 ? getRandomInt(1, 3) : -getRandomInt(1, 3)
                this.velocityX += this.velocityX > 0 ? getRandomInt(1, 3) : -getRandomInt(1, 3)
            }
        }

        this.x += this.velocityX
        this.y += this.velocityY
        updateInfos()
    }
}

class Player {
    constructor(side, brain) {
        this.x = side ? canvas.width - 10 : 0
        this.width = 10
        this.height = side ? 120 : training ? canvas.height + 10 : 120
        this.y = canvas.height / 2 - this.height / 2
        this.color = randColor()
        this.moveSpeed = 15
        this.brain = brain ? brain.copy() : new NeuralNetwork(6, 12, 1)
        this.points = 0
    }

    mutate() {
        this.brain.mutate(0.1)
    }

    draw() {
        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.width, this.height)
    }

    moveUp() {
        if (this.y - this.moveSpeed > 0) {
            this.y -= this.moveSpeed
        } else if (this.y - this.moveSpeed <= 0) {
            this.y = 0
        }
    }

    moveDown() {
        if (this.y + this.moveSpeed + this.height < canvas.height) {
            this.y += this.moveSpeed
        } else if (this.y + this.moveSpeed + this.height >= canvas.height) {
            this.y = canvas.height - this.height
        }
    }

    think() {
        let inputs = []
        inputs[0] = this.y
        inputs[1] = this.moveSpeed
        inputs[2] = ball.x
        inputs[3] = ball.y
        inputs[4] = ball.velocityX
        inputs[5] = ball.velocityY
        this.inputs = inputs

        let output = this.brain.predict(inputs)

        if (output[0] > 0.5)
            this.moveDown()
        else
            this.moveUp()
    }
}

const game = {
    score1: 0,
    score2: 2,

    draw: function () {
        context.fillStyle = 'black'
        context.fillRect(0, 0, canvas.width, canvas.height)

        ball.draw()
        player1.draw()
        if (AIvsAI)
            player1.think()

        if (training) {
            playersRight.forEach(player => {
                player.draw()
                player.think(ball.x, ball.y)
            })

            if (playersRight.length === 0)
                nextGeneration()
        } else {
            player2.draw()
            player2.think()
        }
    },
    gameOver: function (player) {
        if (player)
            game.score2++
        else
            game.score1++

        updateChart(player, 0, player ? game.score2 : game.score1)

        game.reset()
    },
    start: async function () {
        trainedBrain = await getBrain()
        trainedBrain2 = await getBrain2()
        trainingQuantity = 100
        training = true
        AIvsAI = false
        game.reset()
        updateInfos()

        if (!AIvsAI)
            document.addEventListener('keydown', event => {
                if (event.code === 'KeyW')
                    player1.moveUp()
                else if (event.code === 'KeyS')
                    player1.moveDown()
            })

        game.animate()
    },
    reset: function () {
        previousBest = 0
        ball = new Ball()
        if (AIvsAI)
            player1 = new Player(0, NeuralNetwork.deserialize(trainedBrain))
        else
            player1 = new Player(0)

        if (training) {
            playersRight = []
            savedPlayers = []
            generation = 1
            for (let i = 0; i < trainingQuantity; i++) {
                let player = new Player(1)
                playersRight.push(player)
            }
        } else {
            player2 = new Player(1, NeuralNetwork.deserialize(trainedBrain2))
        }
        game.draw()
    },
    animate: function () {
        if (!pause)
            game.draw()

        requestAnimationFrame(game.animate)
    },
    resize: function () {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }
}

game.start()