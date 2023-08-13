let totalMessages = 0
let channelName
let provider

let messagesLimit = 12
let hideDelay = 30000
let easing = 'easeOutCubic'
let chatGap = 8
let chatWidth

let worker
let workerDelay = 100
let sendQueue = []
let deleteQueue = []
let sendQueueBlocked = false
let deleteQueueBlocked = false


window.addEventListener('onWidgetLoad', function (obj) {
    channelName = obj.detail.channel.username
    fetch(`https://api.streamelements.com/kappa/v2/channels/${obj.detail.channel.id}/`).then(response => response.json()).then((profile) => {
        provider = profile.provider
    })

    chatWidth = getContentWidth(document.querySelector(`.chat`))
})

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.event.listener === 'widget-button') {
        if (obj.detail.event.field === 'testMessage') {
            let randomId = `43285909-412c-4eee-b80d-89f72ba5314${Math.floor(Math.random() * 10)}`
            let emulated = new CustomEvent("onEventReceived", {
                detail: {
                    listener: "message", 
                    event: {
                        service: "twitch",
                        data: {
                            time: Date.now(),
                            tags: {
                                "badge-info": "",
                                badges: "moderator/1,partner/1",
                                color: "#5B99FF",
                                "display-name": "StreamElements",
                                emotes: "25:46-50",
                                flags: "",
                                id: randomId,
                                mod: "1",
                                "room-id": "85827806",
                                subscriber: "0",
                                "tmi-sent-ts": "1579444549265",
                                turbo: "0",
                                "user-id": "100135110",
                                "user-type": "mod"
                            },
                            nick: channelName,
                            userId: '100135110',
                            displayName: channelName,
                            displayColor: "#8C3EFF",
                            badges: [{
                                type: "moderator",
                                version: "1",
                                url: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
                                description: "Moderator"
                            }, {
                                type: "partner",
                                version: "1",
                                url: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
                                description: "Verified"
                            }],
                            channel: channelName,
                            text: "Random msgId",
                            isAction: !1,
                            emotes: [],
                            msgId: randomId
                        },
                        renderedText: 'Random msgId'
                    }
                }
            })
            window.dispatchEvent(emulated)
        }
        if (obj.detail.event.field === 'testMessage2') {
            let emulated = new CustomEvent("onEventReceived", {
                detail: {
                    listener: "message", 
                    event: {
                        service: "twitch",
                        data: {
                            time: Date.now(),
                            tags: {
                                "badge-info": "",
                                badges: "moderator/1,partner/1",
                                color: "#5B99FF",
                                "display-name": "StreamElements",
                                emotes: "25:46-50",
                                flags: "",
                                id: "43285909-412c-4eee-b80d-89f72ba53142",
                                mod: "1",
                                "room-id": "85827806",
                                subscriber: "0",
                                "tmi-sent-ts": "1579444549265",
                                turbo: "0",
                                "user-id": "100135110",
                                "user-type": "mod"
                            },
                            nick: channelName,
                            userId: '100135110',
                            displayName: channelName,
                            displayColor: "#8C3EFF",
                            badges: [{
                                type: "moderator",
                                version: "1",
                                url: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
                                description: "Moderator"
                            }, {
                                type: "partner",
                                version: "1",
                                url: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
                                description: "Verified"
                            }],
                            channel: channelName,
                            text: "Testing responsiveness with a longer string Kappa",
                            isAction: !1,
                            emotes: [{
                                type: "twitch",
                                name: "Kappa",
                                id: "25",
                                gif: !1,
                                urls: {
                                    1: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                                    2: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                                    4: "https://static-cdn.jtvnw.net/emoticons/v1/25/3.0"
                                },
                                start: 46,
                                end: 50
                            }],
                            msgId: "43285909-412c-4eee-b80d-89f72ba53142"
                        },
                        renderedText: 'Testing responsiveness with a longer string <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote"/>'
                    }
                }
            })
            window.dispatchEvent(emulated)
        }
        if (obj.detail.event.field === 'testDeleteMessage') {
            let emulated = new CustomEvent("onEventReceived", {
                detail: {
                    listener: "delete-message", 
                    event: {
                        service: "twitch",
                        userId: "100135110",
                        msgId: "43285909-412c-4eee-b80d-89f72ba53142",
                        data: {
                            userId: "100135110",
                            msgId: "43285909-412c-4eee-b80d-89f72ba53142"
                        }
                    }
                }
            })
            window.dispatchEvent(emulated)
        }
        return
    }

    let data = obj.detail.event.data

    if (obj.detail.listener == "delete-message") {
        pushDeleteMessages(`.message[data-mid="${obj.detail.event.msgId}"]`)
        return
    }
    
    if (obj.detail.listener == "delete-messages") {
        pushDeleteMessages(`.message[data-uid="${obj.detail.event.userId}"]`)
        return
    }

    if (obj.detail.listener === "message") {
        let message = attachEmotes(data)
        let badges = ""
        let badge
        for (let i = 0; i < data.badges.length; i++) {
            badge = data.badges[i]
            badges += `<img alt="" src="${badge.url}" class="badge ${badge.type}-icon"> `
        }
        let username = data.displayName + ":"
        if (data.displayColor !== "") {
            username = `<span style="color:${data.displayColor}">${username}</span>`
        } else {
            username = `<span>${username}</span>`
        }
        pushSendMessages(username, badges, message, data.userId, data.msgId)
    }
})


function startQueue() {
    if (worker == null) {
        worker = setInterval(queueWorker, workerDelay)
    }
}

function queueWorker() {
    if (!sendQueue.length && !deleteQueue.length) {
        clearInterval(worker)
        worker = null
        return
    }
    if (!sendQueueBlocked && sendQueue.length > 0) {
        handleSendMessage()
    }
    else if (!deleteQueueBlocked && deleteQueue.length > 0) {
        handleDeleteMessage()
    }
}


// PUSHING TO QUEUE

function pushSendMessages(username, badges, message, userId, msgId) {
    sendQueue.push({
        username: username,
        badges: badges,
        message: message,
        userId: userId,
        msgId: msgId
    })
    startQueue()
}

function pushDeleteMessages(selector) {
    let messages = document.querySelectorAll(selector)
    if (!messages.length) {
        return
    }
    messages.forEach(message => {
        deleteQueue.push(message)
    })
    startQueue()
}


// HANDLERS

function handleSendMessage() {
    sendQueueBlocked = true
    let msgData = sendQueue.pop()

    totalMessages += 1
    document.querySelector('.chat').insertAdjacentHTML('beforeend',
    `<div data-uid="${msgData.userId}" data-mid="${msgData.msgId}" class="message" id="msg-${totalMessages}">
        <div class="message__user">${msgData.badges}${msgData.username}</div>
        <div class="message__content">${msgData.message}</div>
    </div>`)

    if (totalMessages > messagesLimit) {
        handleExpiredMessage(".message:nth-last-child(n+" + (messagesLimit + 1) + ")")
    }

    let message = document.querySelector(`.chat .message:last-child`)
    let messageHeight = message.scrollHeight
    let previousMessages = document.querySelectorAll(`.chat .message:not(:last-child)`)

    message.style.position = 'absolute'
    message.style.maxWidth = `${chatWidth}px`
    anime.set(message, {
        opacity: 0,
        translateX: 64
    })
    var tlS = anime.timeline({
        easing: easing,
        complete: function() {
            anime.set(previousMessages, {
                translateY: 0
            })
            message.style.position = 'static'
            message.style.width = '100%'
            setTimeout(function() { handleExpiredMessage(`.message[data-mid="${msgData.msgId}"]`) }, hideDelay)
            sendQueueBlocked = false
        }
    })
    tlS
    .add({
        targets: previousMessages,
        translateY: function() { return -(messageHeight + chatGap) },
        duration: 250
    })
    .add({
        targets: message,
        opacity: 1,
        translateX: 0,
        duration: 150
    }, '-=150')
}

function handleDeleteMessage() {
    deleteQueueBlocked = true
    let message = deleteQueue.pop()
    let messageHeight = message.scrollHeight
    let previousMessages = getPreviousSiblings(message)

    var tlD = anime.timeline({
        easing: easing,
        complete: function() {
            anime.set(previousMessages, {
                translateY: 0
            })
            message.remove()
            deleteQueueBlocked = false
        }
    })
    tlD
    .add({
        targets: message,
        opacity: 0,
        duration: 150,
    })
    .add({
        targets: previousMessages,
        translateY: function() { return (messageHeight + chatGap) },
        duration: 150,
    }, '-=150')
}

function handleExpiredMessage(selector) {
    let message = document.querySelector(selector) ?? null
    if (!message) return
    message.remove()
}


// HELPERS

function attachEmotes(message) {
    let text = html_encode(message.text)
    let data = message.emotes
    if (typeof message.attachment !== "undefined") {
        if (typeof message.attachment.media !== "undefined") {
            if (typeof message.attachment.media.image !== "undefined") {
                text = `${message.text}<img src="${message.attachment.media.image.src}">`
            }
        }
    }
    return text
        .replace(
            /([^\s]*)/gi,
            function (m, key) {
                let result = data.filter(emote => {
                    return html_encode(emote.name) === key
                })
                if (typeof result[0] !== "undefined") {
                    let url = result[0]['urls'][1]
                    if (provider === "twitch") {
                        return `<img class="emote" src="${url}"/>`
                    } else {
                        if (typeof result[0].coords === "undefined") {
                            result[0].coords = {x: 0, y: 0}
                        }
                        let x = parseInt(result[0].coords.x)
                        let y = parseInt(result[0].coords.y)

                        return `<div class="emote" style="background-image: url(${url}); background-position: -${x}px -${y}px;"></div>`
                    }
                } else return key

            }
        )
}

function html_encode(e) {
    return e.replace(/[<>"^]/g, function (e) {
        return "&#" + e.charCodeAt(0) + ";"
    })
}

function getContentWidth(element) {
    var styles = getComputedStyle(element)
  
    return element.offsetWidth
      - parseFloat(styles.paddingLeft)
      - parseFloat(styles.paddingRight)
}

function getPreviousSiblings(element) {
    var siblings = []
    while (element = element.previousElementSibling) {
        siblings.push(element)
    }
    return siblings
}