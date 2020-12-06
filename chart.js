let trainConfig = {
    type: 'line',
    data: {
        labels: ['0'],
        datasets: [{
            label: 'Hitting',
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgb(75, 192, 192)',
            data: [0],
            fill: false,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Best AI Result'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Generation'
                },
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Points'
                },
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }]
        }
    }
}

let gameConfig = {
    type: 'bar',
    data: {
        labels: ['1'],
        datasets: [{
            label: 'Player 1',
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgb(75, 192, 192)',
            data: [0]
        },
        {
            label: 'Player 2',
            backgroundColor: 'rgb(153, 102, 255)',
            borderColor: 'rgb(153, 102, 255)',
            data: [0]
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Match Results'
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Match'
                },
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Points'
                },
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }]
        }
    }
}

window.onload = function () {
    createChart(trainConfig)
}

function createChart(config) {
    let ctxChart = document.getElementById('chart').getContext('2d')
    window.chart = new Chart(ctxChart, Object.create(config))
}

function AddInChart(datasetIndex, label, data) {
    if (window.chart.data.datasets.length > 0) {
        window.chart.data.labels.push(label)

        try {
            window.chart.data.datasets[datasetIndex].data.push(data)
        } catch (error) {
            console.log(error)
        }

        window.chart.update()
    }
}

function updateChart(datasetIndex, dataIndex, data) {
    if (window.chart.data.datasets.length > 0) {
        try {
            window.chart.data.datasets[datasetIndex].data[dataIndex] = data
        } catch (error) {
            console.log(error)
        }
        window.chart.update()
    }
}