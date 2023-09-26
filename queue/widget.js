let userOptions = {}
let commandName
let channelName
let provider

let ready = true
let isActive = false
let playerQueue = []
let playersCurrent = []
let wrapper
let displayPrimary
let displaySecondary


window.addEventListener('onWidgetLoad', function (obj) {
    channelName = obj.detail.channel.username
    userOptions = obj.detail.fieldData
    commandName = userOptions['commandName']
    fetch(`https://api.streamelements.com/kappa/v2/channels/${obj.detail.channel.id}/`).then(response => response.json()).then((profile) => {
        provider = profile.provider
    })
    
    wrapper = document.querySelector('.main')
    displayPrimary = document.querySelector('.display__primary')
    displaySecondary = document.querySelector('.display__secondary')
})

window.addEventListener('onEventReceived', function (obj) {
    let data = obj.detail.event.data

    if (obj.detail.listener !== 'message') return
    if (obj.detail.listener === "message" && ready) {
        let content = data.text
        let username = data.displayName
        let perms = {
            'broadcaster': (username === channelName),
            'mod': !!parseInt(data.tags.mod),
            'sub': !!parseInt(data.tags.subscriber),
            'vip': (data.tags.badges.indexOf('vip') !== -1),
        }
        
        ready = false
        setTimeout(function() { ready = true }, 1000)

        if (content.startsWith(commandName)) {


            let command = content.replace(commandName, '').split(' ')
            command = command.filter(function (el) {
                return el != ''
            })

            // Streamer or mod can start FC using !fc when it's not active
            if (!command.length && (perms.broadcaster || perms.mod) && !isActive) {
                createSession()
            }
            // Everyone can join, leave or announce their win. Streamer or mod can delete FC when it's active
            else if (command.length && isActive) {
                if (command.includes('join')) {
                    join(username)
                }
                else if (command.includes('leave')) {
                    leave(username)
                }
                else if (command.includes('win')) {
                    next(username)
                }
                else if ((perms.broadcaster || perms.mod) && command.includes('delete')) {
                    deleteSession()
                }
            }
        }
    }
})


function renderUpdate() {
    if (playerQueue.length === 0) {
        displayPrimary.innerHTML = `<p class="title">Waiting for players</p>`
        displaySecondary.innerHTML = `Type <span class="tag">!fc join</span> to join...`
    }
    else if (playerQueue.length <= 2) {
        displayPrimary.innerHTML = `<p class="title">Waiting for players</p>`
        displaySecondary.innerHTML = `Type <span class="tag">!fc join</span> to join... (${playerQueue.length} queued)`
    } 
    else {
        if (userOptions['showMetadata'] == 'yes') {
            displayPrimary.innerHTML = `
                                        <div class="player">
                                            <p class="player__name">${playersCurrent[0].name}</p>
                                            <p class="player__meta">${playersCurrent[0].wins}</p>
                                        </div>
                                        <div class="divider">✦</div>
                                        <div class="player">
                                            <p class="player__meta">${playersCurrent[1].wins}</p>
                                            <p class="player__name">${playersCurrent[1].name}</p>
                                        </div>
                                        `
        } else {
            displayPrimary.innerHTML = `
                                        <div class="player">
                                            <p class="player__name">${playersCurrent[0].name}</p>
                                        </div>
                                        <div class="divider">✦</div>
                                        <div class="player">
                                            <p class="player__name">${playersCurrent[1].name}</p>
                                        </div>
                                        `
        }
        displaySecondary.innerHTML = playerQueue.length >= 4 ? 
                                    `${playerQueue[2].name} is up next (+${playerQueue.length - 3})` : 
                                    `${playerQueue[2].name} is up next`
    }
}


function createSession() {
    renderUpdate()
    isActive = true
    wrapper.classList.remove('hidden')
}

function deleteSession() {
    isActive = false
    wrapper.classList.add('hidden')
    playerQueue = []
    playersCurrent = []
    renderUpdate()
}

function join(name) {
    let player = getPlayerByName(name)
    if (player) return
    playerQueue.push({
        name: name,
        wins: 0
    })

    if (playerQueue.length == 3) {
        playersCurrent = [playerQueue[0], playerQueue[1]]
    }
    renderUpdate()
}

function leave(name) {
    let player = getPlayerByName(name)
    if (!player) return
    
    playerQueue.splice(playerQueue.indexOf(player), 1)
    if (playersCurrent.includes(player)) {
        playersCurrent[playersCurrent.indexOf(player)] = playerQueue[1]
    }
    renderUpdate()
}

function next(name) {
    let player = getPlayerByName(name)
    if (playerQueue.length < 3 || !playersCurrent.includes(player)) return

    player.wins += 1
    loser = playersCurrent[1 - playersCurrent.indexOf(player)]
    playerQueue.splice(playerQueue.indexOf(player), 1)
    playerQueue.splice(playerQueue.indexOf(loser), 1)
    playerQueue = [player, ...playerQueue, loser]

    playersCurrent = [player, playerQueue[1]]
    renderUpdate()
}

// HELPERS

function getPlayerByName(name) {
    return playerQueue.find(player => {
        return player.name === name
    })
}