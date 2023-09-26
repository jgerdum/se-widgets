let userOptions = {}
let channelName
let provider
let hideDelay

let easing = 'easeOutCubic'
let audio

let worker
let workerDelay = 50
let queue = []
let queueBlocked = false

window.addEventListener('onWidgetLoad', function (obj) {
    channelName = obj.detail.channel.username
    userOptions = obj.detail.fieldData
    hideDelay = parseInt(userOptions['hideDelay']) * 1000
    fetch(`https://api.streamelements.com/kappa/v2/channels/${obj.detail.channel.id}/`).then(response => response.json()).then((profile) => {
        provider = profile.provider
    })
    
    audio = new Audio('https://github.com/jgerdum/se-widgets/blob/main/alert-aside/assets/audio-follow.wav?raw=true')
    audio.volume = 0.25
    reset()
})

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener === "follower-latest") {
        let data = obj.detail.event
        let username = data.name

        queue.push(username)
        startQueue()
    }
})



// HEARTBEAT / WORKER

function startQueue() {
    if (worker == null) {
        worker = setInterval(queueWorker, workerDelay)
    }
}

function queueWorker() {
    if (!queue.length) {
        clearInterval(worker)
        worker = null
        return
    }
    if (!queueBlocked && queue.length > 0) {
        handleShowAlert()
    }
}


// ANIMATIONS

function handleShowAlert() {
    queueBlocked = true
    let username = queue.pop()

    document.querySelector('.message__content').innerHTML = `${username} joined the Nightmare`
    audio.play()

    var tl = anime.timeline({
        easing: easing,
        duration: 1000,
        complete: function() {
            setTimeout(hideAlert, hideDelay)
        }
    })
    tl
    .add({
        targets: '.main',
        opacity: 1,
        translateX: 0,
    })
    .add({
        targets: '.message__bg',
        duration: 500,
        width: '100%'
    }, '-=1000')
}


function reset() {
    audio.pause()
    audio.currentTime = 0

    anime.set('.main', {
        opacity: 0,
        translateX: 64
    })
    anime.set('.message__bg', {
        width: '10%'
    })
}

function hideAlert() {
    var tl = anime.timeline({
        easing: easing,
        duration: 1000,
        complete: function() {
            reset()
            queueBlocked = false
        }
    })
    tl
    .add({
        targets: '.message__bg',
        duration: 500,
        width: '10%'
    })
    .add({
        targets: '.main',
        opacity: 0,
        translateX: 64
    }, '-=500')
}