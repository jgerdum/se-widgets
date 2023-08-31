let channelName
let provider

let commandName = '!counter'
let easing = 'easeOutCubic'

let counters = []
const columnInner = `<span>0</span>
                    <div class="counter__column__inner">
                        <span>0</span>
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                        <span>6</span>
                        <span>7</span>
                        <span>8</span>
                        <span>9</span>
                    </div>`

class Counter {
    constructor(label = "Counter", defaultValue = 0) {
        this._defaultValue = defaultValue

        this._label = label
        this._value = defaultValue

        let splitLabel = this._label.split(' ')
        this._id = `counter-${splitLabel.join('_')}-${~~(Math.random() * 10)}`
        this._columns = [
            {
                id: `${this._id}__column-0`,
                value: 0,
                html: `<div class="counter__column" id="${this._id}__column-0">
                        ${columnInner}
                    </div>
                    `
            }
        ]
        this._previousColumnAmount = this.#splitValue().length

        let wrapper = document.querySelector('.main')
        let renderedColumns = this._columns.map(function(column){
            return column.html
        }).join('')
        wrapper.insertAdjacentHTML('beforeend', 
        `<div class="counter" id="${this._id}">
            <div class="counter__main">
                <div class="counter__svg">
                    <svg width="8" height="130" viewBox="0 0 8 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1V129" stroke="url(#paint0_linear_2458_30)" stroke-width="2" stroke-linecap="round"/>
                        <path d="M7 33V129" stroke="url(#paint1_linear_2458_30)" stroke-width="2" stroke-linecap="round"/>
                        <defs>
                        <linearGradient id="paint0_linear_2458_30" x1="0.5" y1="1" x2="0.5" y2="129" gradientUnits="userSpaceOnUse">
                        <stop stop-color="white" stop-opacity="0"/>
                        <stop offset="0.5" stop-color="white"/>
                        <stop offset="0.869792" stop-color="white"/>
                        <stop offset="1" stop-color="white" stop-opacity="0"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_2458_30" x1="6.5" y1="33" x2="6.5" y2="129" gradientUnits="userSpaceOnUse">
                        <stop stop-color="white" stop-opacity="0"/>
                        <stop offset="0.5" stop-color="white"/>
                        <stop offset="0.869792" stop-color="white"/>
                        <stop offset="1" stop-color="white" stop-opacity="0"/>
                        </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div class="counter__content">
                    <span class="counter__value">${renderedColumns}</span>
                    <span class="counter__label">${this._label}</span>
                </div>
            </div>
            <svg width="198" height="18" viewBox="0 0 198 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M53 12C51 12 50 11 50 8.99999C50 6.99999 52 5.99999 54 5.99999C57.7148 5.99999 62 9.49999 58.6491 14.6646M118 1.99999L119.075 1.0003M119.075 1.0003L127 1.0003M119.075 1.0003L87 0.99999M127 1.0003L131 0.999994M127 1.0003C128.657 1.0003 130 2.34344 130 4.0003C130 5.65715 128.657 7.0003 127 7.0003C125.343 7.0003 124 5.65715 124 4.0003M131 0.999994C135 1.0003 138 8.99999 142 9C144.209 9 146 7.20913 146 5C146 2.79086 144.762 0.999995 142.5 0.999995M131 0.999994L142.5 0.999995M142.5 0.999995C141 0.999995 140 2 140 3C140 4.5 142 5 142 5M142.5 0.999995L197 0.999996M87 0.99999L88 1.99999M87 0.99999L83 0.99999M83 0.99999L86 4.99999M83 0.99999L77 0.99999M77 0.99999C78.6568 0.99999 80 2.34314 80 3.99999C80 5.65684 78.6568 6.99999 77 6.99999C75.3431 6.99999 74 5.65684 74 3.99999M77 0.99999L71 0.999989M53 0.999987C48.5817 0.999987 45 4.58171 45 8.99999C45 13.4183 48.5817 17 53 17C55.2052 17 57.202 16.1078 58.6491 14.6646M53 0.999987L63 0.999988M53 0.999987L0.999986 0.999988M58.6491 14.6646L71 0.999989M58.6491 14.6646C61 12.0636 63 13 65 14M71 0.999989L63 0.999988M63 0.999988L61 2.99999" stroke="url(#paint0_linear_2462_46)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <defs>
                <linearGradient id="paint0_linear_2462_46" x1="1.00001" y1="0.999935" x2="197" y2="0.999935" gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0"/>
                <stop offset="0.153061" stop-color="white"/>
                <stop offset="0.597076" stop-color="white"/>
                <stop offset="1" stop-color="white" stop-opacity="0"/>
                </linearGradient>
                </defs>
            </svg>
        </div>`
        )

        this.#update()
    }

    get label() {
        return this._label
    }

    get value() {
        return this._value
    }

    #splitValue() {
        return this._value.toString().split('').map(Number)
    }

    #update() {
        let instance = document.getElementById(this._id)
        let valueElement = instance.querySelector('.counter__value')

        // Get updated value array
        let valueArray = this.#splitValue()

        // Add or remove columns based on length of value array
        if (valueArray.length !== this._previousColumnAmount) {
            if (valueArray.length > this._previousColumnAmount) {
                let colId = `${this._id}__column-${this._columns.length}`
                this._columns.push(
                    {
                        id: colId,
                        value: 0,
                        html: `<div class="counter__column" id="${colId}">
                                ${columnInner}
                            </div>
                            `
                    }
                )
                valueElement.insertAdjacentHTML('beforeend', this._columns[this._columns.length - 1].html)
                let lastColumn = valueElement.querySelector('.counter__column:last-of-type')
                anime.set(lastColumn, {
                    opacity: 0
                })
                anime({
                    targets: lastColumn,
                    opacity: 1,
                    easing: easing,
                    duration: 500
                })

            } else if (valueArray.length < this._previousColumnAmount){
                this._columns.pop()
                let lastColumn = valueElement.querySelector('.counter__column:last-of-type')
                var tlS = anime.timeline({
                    easing: easing,
                    complete: function() {
                        lastColumn.remove()
                    }
                })
                tlS
                .add({
                    targets: lastColumn,
                    opacity: 0,
                    duration: 500,
                })
                
            }
            this._previousColumnAmount = valueArray.length
        }

        // Set correct value for each column
        for (let i = 0; i < this._columns.length; i++) {
            if ((this._columns[i].value !== valueArray[i]) || valueArray[i] == 0) {
                let column = valueElement.querySelector(`#${this._columns[i].id}`)
                let columnInner = column.querySelector('.counter__column__inner')
                let numHeight = columnInner.offsetHeight / 10
                columnInner.style.transform = `translateY(-${numHeight * valueArray[i]}px)`
            }
        }
    }

    change(amount) {
        if (amount.includes('+') || amount.includes('-')) {
            this._value += parseInt(amount)
            this._value = Math.max(this._value, 0)
        } else {
            this._value = Math.max(parseInt(amount), 0)
        }
        this.#update()
    }

    reset() {
        this._value = this._defaultValue
        this.#update()
    }

    delete() {
        let instance = document.getElementById(this._id)
        instance.remove()
    }
}


window.addEventListener('onWidgetLoad', function (obj) {
    channelName = obj.detail.channel.username
    fetch(`https://api.streamelements.com/kappa/v2/channels/${obj.detail.channel.id}/`).then(response => response.json()).then((profile) => {
        provider = profile.provider
    })
})

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.event.listener === 'widget-button') {
        if (obj.detail.event.field === 'testCommand0') {
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
                            text: '!counter "Wins"',
                            isAction: !1,
                            emotes: [],
                            msgId: "43285909-412c-4eee-b80d-89f72ba53142"
                        },
                        renderedText: '!counter "Wins"'
                    }
                }
            })
            window.dispatchEvent(emulated)
        }
        if (obj.detail.event.field === 'testCommand1') {
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
                            text: '!counter "Losses"',
                            isAction: !1,
                            emotes: [],
                            msgId: "43285909-412c-4eee-b80d-89f72ba53142"
                        },
                        renderedText: '!counter "Losses"'
                    }
                }
            })
            window.dispatchEvent(emulated)
        }
        if (obj.detail.event.field === 'testCommand2') {
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
                            text: '!counter "Wins" +1',
                            isAction: !1,
                            emotes: [],
                            msgId: "43285909-412c-4eee-b80d-89f72ba53142"
                        },
                        renderedText: '!counter "Wins" +1'
                    }
                }
            })
            window.dispatchEvent(emulated)
        }
        if (obj.detail.event.field === 'testCommand3') {
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
                            text: '!counter reset-all',
                            isAction: !1,
                            emotes: [],
                            msgId: "43285909-412c-4eee-b80d-89f72ba53142"
                        },
                        renderedText: '!counter reset-all'
                    }
                }
            })
            window.dispatchEvent(emulated)
        }
        if (obj.detail.event.field === 'testCommand4') {
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
                            text: '!counter "Losses" +1',
                            isAction: !1,
                            emotes: [],
                            msgId: "43285909-412c-4eee-b80d-89f72ba53142"
                        },
                        renderedText: '!counter "Losses" +1'
                    }
                }
            })
            window.dispatchEvent(emulated)
        }
        if (obj.detail.event.field === 'testCommand5') {
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
                            text: '!counter "Wins" delete',
                            isAction: !1,
                            emotes: [],
                            msgId: "43285909-412c-4eee-b80d-89f72ba53142"
                        },
                        renderedText: '!counter "Wins" delete'
                    }
                }
            })
            window.dispatchEvent(emulated)
        }
        return
    }

    let data = obj.detail.event.data

    if (obj.detail.listener !== 'message') return
    if (obj.detail.listener === "message") {
        let content = data.text
        let username = data.displayName
        let perms = {
            'broadcaster': (username === channelName),
            'mod': !!parseInt(data.tags.mod),
            'sub': !!parseInt(data.tags.subscriber),
            'vip': (data.tags.badges.indexOf('vip') !== -1),
        }

        if ((perms.broadcaster || perms.mod) && content.startsWith(`${commandName}`)) {

            let { label, command } = extractData(content)

            if (!label && !command.length) return
            if (label && !command.length) {
                // Check if counter already exists and label is HTML id-safe
                if (/^[a-z0-9\-_ ]+$/i.test(label) && (counters.find(counter => counter.label === label) === undefined)) {
                    counters.push(new Counter(label = label))
                }
                return
            }
            if (counters.length) {
                if (!label) {
                    // No label but we don't need it since it's -all
                    if (command.includes('reset-all')) {
                        for (const counter of counters) {
                            counter.reset()
                        }
                    }
                    else if (command.includes('delete-all')) {
                        for (const counter of counters) {
                            counter.delete()
                        }
                        counters = []
                    }
                    // Can't do anything else without a label if we have 2+ counters
                    else if (counters.length > 1) { 
                        return 
                    }
                    // No label but only one counter we use can that one
                    else {
                        if (command.includes('reset')) {
                            counters[0].reset()
                        }
                        else if (command.includes('delete')) {
                            counters[0].delete()
                            counters = []
                        }
                        else {
                            counters[0].change(command)
                        }
                    }
                }
                else {
                    let counterIndex = counters.findIndex(counter => counter.label === label)
                    if (counterIndex !== -1) {
                        if (command.includes('reset')) {
                            counters[counterIndex].reset()
                        }
                        else if (command.includes('delete')) {
                            counters[counterIndex].delete()
                            counters.splice(counterIndex, 1);
                        }
                        else {
                            counters[counterIndex].change(command)
                        }
                    }
                }
            }
        }
    }
})

// HELPERS

function extractData(content) {
    content = content.replace(`${commandName} `, '').split(' ')
    let labelLength = 0
    let labelArray = []
    for (let i = 0; i < content.length; i++) {
        if (content[i].includes('"')) {
            labelArray.push(content[i].replace(/['"]+/g, ''))
            labelLength = i + 1
        }
    }
    return {
        label: labelArray.join(' '), 
        command: content.slice(labelLength)[0] ?? []
    }

}

function html_encode(e) {
    return e
        .replace(/[<>"^]/g, 
        function (e) {
                return "&#" + e.charCodeAt(0) + ";"
            }
        )
}
