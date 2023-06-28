let channelName
let provider
let hideDelay = 3000
let easing = 'easeOutCubic'
let audio

window.addEventListener('onWidgetLoad', function (obj) {
    channelName = obj.detail.channel.username
    fetch('https://api.streamelements.com/kappa/v2/channels/' + obj.detail.channel.id + '/').then(response => response.json()).then((profile) => {
        provider = profile.provider
    })
    reset()
    
    audio = new Audio('https://github.com/jgerdum/se-widgets/blob/main/alert-aside/assets/audio-follow.wav?raw=true')
    audio.volume = 0.25

})

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener === "follower-latest") {
        let data = obj.detail.event
        let username = data.name

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
})

function reset() {
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