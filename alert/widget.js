let userOptions = {}
let channelName
let provider
let hideDelay
let hideSubDelay
let hideGiftDelay
let hideRaidDelay

let easing = 'easeOutCubic'
let audioSub
let audioGift
let audioRaid
let icon

let worker
let workerDelay = 50
let queue = []
let queueBlocked = false

window.addEventListener('onWidgetLoad', function (obj) {
    channelName = obj.detail.channel.username
    userOptions = obj.detail.fieldData
    hideSubDelay = parseInt(userOptions['hideSubDelay']) * 1000
    hideGiftDelay = parseInt(userOptions['hideGiftDelay']) * 1000
    hideRaidDelay = parseInt(userOptions['hideRaidDelay']) * 1000
    fetch(`https://api.streamelements.com/kappa/v2/channels/${obj.detail.channel.id}/`).then(response => response.json()).then((profile) => {
        provider = profile.provider
    })
    
    audioSub = new Audio('https://github.com/jgerdum/se-widgets/blob/main/alert/assets/audio-sub.wav?raw=true')
    audioSub.volume = 0.25
    audioGift = new Audio('https://github.com/jgerdum/se-widgets/blob/main/alert/assets/audio-gift.wav?raw=true')
    audioGift.volume = 0.25
    audioRaid = new Audio('https://github.com/jgerdum/se-widgets/blob/main/alert/assets/audio-raid.wav?raw=true')
    audioRaid.volume = 0.25
    reset()

    icon = document.querySelector('.message__icon')
})

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== 'subscriber-latest' && obj.detail.listener !== 'raid-latest') return

    if (!obj.detail.event.isCommunityGift) {
        queue.push({
            type: obj.detail.listener,
            isBulk: obj.detail.event.bulkGifted,
            name: obj.detail.event.name,
            amount: obj.detail.event.amount
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
    let event = queue.pop()

    if (event.type === 'subscriber-latest') {
        if (event.isBulk) {
            icon.innerHTML = '<svg width="24px" height="24px" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><rect x="32" y="80" width="192" height="48" rx="8" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M208,128v72a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V128" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="128" y1="80" x2="128" y2="208" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M176.79,31.21c9.34,9.34,9.89,25.06,0,33.82C159.88,80,128,80,128,80s0-31.88,15-48.79C151.73,21.32,167.45,21.87,176.79,31.21Z" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M79.21,31.21c-9.34,9.34-9.89,25.06,0,33.82C96.12,80,128,80,128,80s0-31.88-15-48.79C104.27,21.32,88.55,21.87,79.21,31.21Z" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>'
            content = `${event.name} gifted ${event.amount} ${event.amount > 1 ? 'subscriptions' : 'subscription'}`
            audioGift.play()
            hideDelay = hideGiftDelay
        } else {
            icon.innerHTML = '<svg width="24px" height="24px" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M128,224l89.36-90.64a50,50,0,1,0-70.72-70.72L128,80,109.36,62.64a50,50,0,0,0-70.72,70.72Z" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>'
            if (event.amount > 1) {
                content = `${event.name} subscribed for ${event.amount} months!`
            } else {
                content = `Thank you for subscribing, ${event.name}`
            }
            audioSub.play()
            hideDelay = hideSubDelay
        }
    }
    else if (event.type === 'raid-latest') {
        icon.innerHTML = '<svg width="24px" height="24px" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M224,120a96,96,0,0,0-192,0Z" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="224 120 128 192 32 120" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="128" y1="192" x2="128" y2="224" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="112" y1="224" x2="144" y2="224" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M128,192,88,120c0-72,40-96,40-96s40,24,40,96Z" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>'
        content = `${event.name} joined the Nightmare with ${event.amount} ${event.amount > 1 ? 'raiders' : 'raider'}`
        audioRaid.play()
        hideDelay = hideRaidDelay
    }

    document.querySelector('.message__content').innerHTML = content

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
        translateY: 0,
        scale: 1
    })
    .add({
        targets: '.message__icon',
        keyframes: [
            { scale: 1.25 },
            { scale: 1 },
        ]
    })
}

function reset() {
    audioSub.pause()
    audioSub.currentTime = 0
    audioGift.pause()
    audioGift.currentTime = 0
    audioRaid.pause()
    audioRaid.currentTime = 0

    anime.set('.main', {
        opacity: 0,
        translateY: 64,
        scale: 0.9
    })
    anime.set('.message__icon', {
        scale: 1,
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
        targets: '.main',
        opacity: 0,
        translateY: -64
    })
}