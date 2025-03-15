let userOptions = {}
let channelName
let provider
let currencySymbol
let hideDelay = 3000

let audio

let icon
let content

let worker
let workerDelay = 1
let queue = []
let queueBlocked = false

let enabledEvents = [
    'follower-latest',
    'subscriber-latest', 
    'raid-latest', 
    'tip-latest', 
    'cheer-latest'
]   

window.addEventListener('onWidgetLoad', function (obj) {
    channelName = obj.detail.channel.username
    userOptions = obj.detail.fieldData
    currencySymbol = obj.detail.currency.symbol
    fetch(`https://api.streamelements.com/kappa/v2/channels/${obj.detail.channel.id}/`).then(response => response.json()).then((profile) => {
        provider = profile.provider
    })
    

    audio = new Audio('https://github.com/jgerdum/se-widgets/blob/main/assets/event.ogg?raw=true')
    audio.volume = 0.25
    reset()
})

window.addEventListener('onEventReceived', function (obj) {
    if (!enabledEvents.includes(obj.detail.listener)) return

    if (!obj.detail.event.isCommunityGift) {
        queue.push({
            type: obj.detail.listener,
            isGifted: obj.detail.event.gifted || obj.detail.event.bulkGifted,
            isBulkGifted: obj.detail.event.bulkGifted,
            name: obj.detail.event.name,
            amount: obj.detail.event.amount,
            sender: obj.detail.event.sender
        })
    }
    startQueue()
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
    let event = queue.shift()

    if (event.type === 'follower-latest') {
        content = `${event.name} just followed`
    }
    else if (event.type === 'subscriber-latest') {
        if (event.isBulkGifted) {
            content = `${event.name} just gifted ${event.amount} ${event.amount > 1 ? 'subscriptions' : 'subscription'}`
        } 
        else if (event.isGifted) {
            content = `${event.sender} just gifted a subscription to ${event.name}`
        }
        else if (!event.amount) {
            content = `${event.name} just subscribed`
            audio.play()
        }
        else {
            content = `${event.name} subscribed for ${event.amount} ${event.amount > 1 ? 'months' : 'month'}`
            audio.play()
        }
    }
    else if (event.type === 'raid-latest') {
        content = `${event.name} just brought ${event.amount} ${event.amount > 1 ? 'raiders' : 'raider'}`
    }
    else if (event.type === 'tip-latest') {
        content = `${event.name} just donated ${currencySymbol}${event.amount}`
    }
    else if (event.type === 'cheer-latest') {
        content = `${event.name} just donated ${event.amount} ${event.amount > 1 ? 'bits' : 'bit'}`
    }

    audio.play()
    var typewriter = new Typewriter(document.querySelector('.message'), {
        cursor: ' :3',
        delay: 25,
        loop: false
    })
    typewriter.typeString(content).start()

    var tl = anime.timeline({
        easing: 'easeOutCubic',
        duration: 1000,
        complete: function() {
            setTimeout(hideAlert, hideDelay)
        }
    })
    tl
    .add({
        targets: '.main',
        opacity: 1,
        translateY: 0,
        scale: 1
    })
}

function reset() {
    audio.pause()
    audio.currentTime = 0

    anime.set('.main', {
        opacity: 0,
        translateY: 64,
        scale: 0.9
    })
}

function hideAlert() {
    var tl = anime.timeline({
        easing: 'easeOutCubic',
        duration: 500,
        complete: function() {
            reset()
            queueBlocked = false
        }
    })
    tl
    .add({
        targets: '.main',
        opacity: 0,
        translateY: -64
    })
}