let channelName
let provider
let hideDelay = 3000
let easing = 'easeOutCubic'

window.addEventListener('onWidgetLoad', function (obj) {
    channelName = obj.detail.channel.username
    fetch('https://api.streamelements.com/kappa/v2/channels/' + obj.detail.channel.id + '/').then(response => response.json()).then((profile) => {
        provider = profile.provider
    })

    reset()
})

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener === "subscriber-latest") {
        let data = obj.detail.event
        let username = data.name

        let content = `Thank you for subscribing, ${username}`
        let icon = document.querySelector('.message__icon')

        if (data.gifted) {
            content = `${data.sender} gifted ${data.amount} ${data.amount > 1 ? 'subscriptions' : 'subscription'}`
            icon.innerHTML = '<svg width="24px" height="24px" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="white"><path d="M20 12v9.4a.6.6 0 01-.6.6H4.6a.6.6 0 01-.6-.6V12M21.4 7H2.6a.6.6 0 00-.6.6v3.8a.6.6 0 00.6.6h18.8a.6.6 0 00.6-.6V7.6a.6.6 0 00-.6-.6zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
        } else {
            var audio = new Audio('https://cdn.freesound.org/previews/72/72125_1028972-lq.ogg')
            audio.play()
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
                { scale: 1 },
                { scale: 0.8 },
                { scale: 1 },
            ]
        })
    }
})

function reset() {
    anime.set('.main', {
        opacity: 0,
        translateY: 64,
        scale: 0.9
    })
    anime.set('.message__icon', {
        scale: 0.8,
    })
}

function hideAlert() {
    
    var tl = anime.timeline({
        easing: easing,
        duration: 1000,
        complete: function() {
            reset()
        }
    })
    tl
    .add({
        targets: '.main',
        opacity: 0,
        translateY: -64
    })
}