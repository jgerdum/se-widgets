let userOptions = {}
let channelName
let provider
let currencySymbol
let hideDelay = 2000

let easing = 'easeOutCubic'

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
            sender: obj.detail.event.sender,
            message: obj.detail.event.message
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
        icon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.25 5C19.6688 5 17.4088 6.11 16 7.98625C14.5912 6.11 12.3312 5 9.75 5C7.69528 5.00232 5.72539 5.81958 4.27248 7.27248C2.81958 8.72539 2.00232 10.6953 2 12.75C2 21.5 14.9737 28.5825 15.5262 28.875C15.6719 28.9533 15.8346 28.9943 16 28.9943C16.1654 28.9943 16.3281 28.9533 16.4737 28.875C17.0262 28.5825 30 21.5 30 12.75C29.9977 10.6953 29.1804 8.72539 27.7275 7.27248C26.2746 5.81958 24.3047 5.00232 22.25 5ZM16 26.85C13.7175 25.52 4 19.4612 4 12.75C4.00198 11.2256 4.60842 9.76423 5.68633 8.68633C6.76423 7.60842 8.22561 7.00198 9.75 7C12.1813 7 14.2225 8.295 15.075 10.375C15.1503 10.5584 15.2785 10.7153 15.4432 10.8257C15.6079 10.9361 15.8017 10.995 16 10.995C16.1983 10.995 16.3921 10.9361 16.5568 10.8257C16.7215 10.7153 16.8497 10.5584 16.925 10.375C17.7775 8.29125 19.8187 7 22.25 7C23.7744 7.00198 25.2358 7.60842 26.3137 8.68633C27.3916 9.76423 27.998 11.2256 28 12.75C28 19.4513 18.28 25.5188 16 26.85Z" fill="white"/></svg>'
        content = `${event.name} followed`
    }
    else if (event.type === 'subscriber-latest') {
        if (event.isGifted) {
            icon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="21" y="18" width="8" height="14" fill="#D2B2FF"/><rect x="21" y="10" width="9" height="6" fill="#D2B2FF"/><rect x="2" y="10" width="9" height="6" fill="#D2B2FF"/><rect x="3" y="18" width="8" height="14" fill="#D2B2FF"/><path d="M14 8H18V31H14V8Z" fill="url(#paint0_linear_4004_79)"/><path d="M16.0751 7.99961C21.8178 8.02293 24.7404 6.99132 25.6963 5.01311C26.6659 3.00655 25.2115 1 22.7874 1C20.3633 1 16.9696 4.00983 16.0751 7.99961ZM16.0751 7.99961H15.9249M15.9249 7.99961C10.1822 8.02293 7.25965 6.99132 6.30372 5.01311C5.33409 3.00655 6.78853 1 9.2126 1C11.6367 1 15.0304 4.00983 15.9249 7.99961ZM14 8H18V31H14V8Z" stroke="url(#paint1_linear_4004_79)" stroke-width="2"/><defs><linearGradient id="paint0_linear_4004_79" x1="16" y1="1" x2="16" y2="31" gradientUnits="userSpaceOnUse"><stop stop-color="#A162FF"/><stop offset="1" stop-color="#833FE6"/></linearGradient><linearGradient id="paint1_linear_4004_79" x1="16" y1="1" x2="16" y2="31" gradientUnits="userSpaceOnUse"><stop stop-color="#A162FF"/><stop offset="1" stop-color="#833FE6"/></linearGradient></defs></svg>'
        } 
        else {
            icon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.25 5C19.6688 5 17.4088 6.11 16 7.98625C14.5912 6.11 12.3312 5 9.75 5C7.69528 5.00232 5.72539 5.81958 4.27248 7.27248C2.81958 8.72539 2.00232 10.6953 2 12.75C2 21.5 14.9737 28.5825 15.5262 28.875C15.6719 28.9533 15.8346 28.9943 16 28.9943C16.1654 28.9943 16.3281 28.9533 16.4737 28.875C17.0262 28.5825 30 21.5 30 12.75C29.9977 10.6953 29.1804 8.72539 27.7275 7.27248C26.2746 5.81958 24.3047 5.00232 22.25 5ZM16 26.85C13.7175 25.52 4 19.4612 4 12.75C4.00198 11.2256 4.60842 9.76423 5.68633 8.68633C6.76423 7.60842 8.22561 7.00198 9.75 7C12.1813 7 14.2225 8.295 15.075 10.375C15.1503 10.5584 15.2785 10.7153 15.4432 10.8257C15.6079 10.9361 15.8017 10.995 16 10.995C16.1983 10.995 16.3921 10.9361 16.5568 10.8257C16.7215 10.7153 16.8497 10.5584 16.925 10.375C17.7775 8.29125 19.8187 7 22.25 7C23.7744 7.00198 25.2358 7.60842 26.3137 8.68633C27.3916 9.76423 27.998 11.2256 28 12.75C28 19.4513 18.28 25.5188 16 26.85Z" fill="white"/></svg>'
        }
        if (event.isBulkGifted) {
            content = `${event.name} gifted ${event.amount} ${event.amount > 1 ? 'subscriptions' : 'subscription'}`
        } 
        else if (event.isGifted) {
            content = `${event.sender} gifted a subscription to ${event.name}`
        }
        else {
            content = `${event.name} subscribed for ${event.amount} ${event.amount > 1 ? 'months' : 'month'}`
        }
    }
    else if (event.type === 'raid-latest') {
        icon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M29 15C28.996 11.5534 27.6251 8.24911 25.188 5.812C22.7509 3.37488 19.4466 2.00397 16 2C12.5534 2.00397 9.24911 3.37488 6.812 5.812C4.37488 8.24911 3.00397 11.5534 3 15C2.99972 15.151 3.03392 15.3001 3.09999 15.436C3.16606 15.5718 3.26226 15.6907 3.38125 15.7837C3.3869 15.7898 3.39319 15.7953 3.4 15.8L15 24.5V27H14C13.7348 27 13.4804 27.1054 13.2929 27.2929C13.1054 27.4804 13 27.7348 13 28C13 28.2652 13.1054 28.5196 13.2929 28.7071C13.4804 28.8946 13.7348 29 14 29H18C18.2652 29 18.5196 28.8946 18.7071 28.7071C18.8946 28.5196 19 28.2652 19 28C19 27.7348 18.8946 27.4804 18.7071 27.2929C18.5196 27.1054 18.2652 27 18 27H17V24.5L28.6 15.8C28.7242 15.7069 28.825 15.5861 28.8944 15.4472C28.9639 15.3084 29 15.1552 29 15ZM26.955 14H21.9788C21.7863 9.25625 20.24 6.19625 18.84 4.375C21.0133 4.95932 22.9558 6.19474 24.4064 7.91532C25.857 9.63589 26.7464 11.7592 26.955 14ZM16 4.25C16.6698 4.84187 17.2538 5.52428 17.735 6.2775C18.6863 7.75 19.8063 10.2338 19.9775 14H12.0225C12.1938 10.2338 13.3138 7.75 14.265 6.2825C14.7459 5.52754 15.3299 4.84344 16 4.25ZM19.3 16L16 21.9412L12.7 16H19.3ZM10.4112 16L12.8488 20.3862L7 16H10.4112ZM21.5888 16H25L19.1513 20.3862L21.5888 16ZM13.16 4.375C11.76 6.19625 10.2137 9.25625 10.0212 14H5.045C5.2536 11.7592 6.14295 9.63589 7.59359 7.91532C9.04424 6.19474 10.9867 4.95932 13.16 4.375Z" fill="white"/></svg>'
        content = `${event.name} brought ${event.amount} ${event.amount > 1 ? 'raiders' : 'raider'}`
    }

    if (event.message) {
        content = `${content}: "${event.message}"`
    }

    var fittyElement = fitty('.message__content', {
        minSize: 24,
        maxSize: 32,
        multiLine: true,
    })
    document.querySelector('.message__icon').innerHTML = icon
    document.querySelector('.message__content').innerHTML = content
    fittyElement[0].fit({ sync: true })
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
    audio.pause()
    audio.currentTime = 0

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