let previousBestElement = document.getElementById('previousBest')
let currentBestElement = document.getElementById('currentBest')
let livePlayersElement = document.getElementById('livePlayers')
let generationElement = document.getElementById('generation')
let trainInfosElement = document.getElementById('train')
let gameInfosElement = document.getElementById('game')
let player1NameElement = document.getElementById('player1-name')
let player1ValueElement = document.getElementById('player1Points')
let player2NameElement = document.getElementById('player2-name')
let player2ValueElement = document.getElementById('player2Points')
let playButton = document.getElementById('playAI')
let playAIButton = document.getElementById('playAI2')
let trainButton = document.getElementById('trainAI')
let saveBrainButton = document.getElementById('saveBrain')
let pauseButton = document.getElementById('pause')


playButton.addEventListener('click', function () {
    training = false
    AIvsAI = false
    player1NameElement.innerHTML = 'Player 1'
    player2NameElement.innerHTML = 'AI'
    trainInfosElement.style.display = 'none'
    gameInfosElement.style.display = 'flex'
    saveBrainButton.style.display = 'none'
    window.chart.destroy()
    createChart(gameConfig)
    game.score2 = 0
    game.score1 = 0
    game.reset()
})

playAIButton.addEventListener('click', function () {
    training = false
    AIvsAI = true
    player1NameElement.innerHTML = 'AI'
    player2NameElement.innerHTML = 'AI'
    trainInfosElement.style.display = 'none'
    gameInfosElement.style.display = 'flex'
    saveBrainButton.style.display = 'none'
    window.chart.destroy()
    createChart(gameConfig)
    game.score2 = 0
    game.score1 = 0
    game.reset()
})

trainButton.addEventListener('click', function () {
    training = true
    trainInfosElement.style.display = 'flex'
    gameInfosElement.style.display = 'none'
    saveBrainButton.style.display = 'block'
    window.chart.destroy()
    createChart(trainConfig)
    game.reset()
})

saveBrainButton.addEventListener('click', function () {
    let bestPlayer = getCurrentBestPlayer()
    downloadObjectAsJson(bestPlayer.brain.serialize(), 'neuralnetwork')
})

pauseButton.addEventListener('click', function () {
    pause = !pause
    pauseButton.innerHTML = pause ? 'Resume' : 'Pause'
})

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getBrain() {
    return new Promise((resolve, reject) => {
        fetch('trained/brain.json')
            .then(data => data.json())
            .then(response => {
                resolve(response)
            })
    })
}

function getBrain2() {
    return new Promise((resolve, reject) => {
        fetch('trained/brain2.json')
            .then(data => data.json())
            .then(response => {
                resolve(response)
            })
    })
}

function randColor() {
    let r = 255 * Math.random() | 0,
        g = 255 * Math.random() | 0,
        b = 255 * Math.random() | 0;
    return 'rgb(' + r + ',' + g + ',' + b + ')'
}

function nextGeneration() {
    lastPoints = 0
    let best = getBestPlayer()
    generation++
    updateInfos()
    AddInChart(0, generation, best.points)

    playersRight = []
    for (let i = 0; i < trainingQuantity; i++) {
        let player = pickOne()
        playersRight.push(player)
    }
    savedPlayers = []
    ball = new Ball()
}

function pickOne() {
    let best = getBestPlayer()

    let child = new Player(canvas.width - 10, best.brain)
    child.mutate()
    return child
}

function getBestPlayer() {
    previousBest = 0
    let high = 0
    let best
    for (let savedPlayersBest of savedPlayers) {
        if (savedPlayersBest.points >= high) {
            high = savedPlayersBest.points
            best = savedPlayersBest
        }
    }
    previousBest = high
    return best
}

function getCurrentBestPlayer() {
    let high = 0
    let best
    if (training) {
        for (let player of playersRight) {
            if (player.points >= high) {
                high = player.points
                best = player
            }
        }
    } else {
        best = player1.points > player2.points ? player1 : player2
    }
    return best
}

function updateInfos() {
    previousBestElement.innerHTML = previousBest
    currentBestElement.innerHTML = getCurrentBestPlayer() ? getCurrentBestPlayer().points : 0
    livePlayersElement.innerHTML = playersRight.length
    generationElement.innerHTML = generation
    player1ValueElement.innerHTML = game.score1
    player2ValueElement.innerHTML = game.score2
}

function downloadObjectAsJson(exportObj, exportName) {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(exportObj)}`
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute('download', `${exportName}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
}
