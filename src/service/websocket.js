export default class WebSocketService {
    constructor() {
        this.socket = null
        this.newMessage = null
    }

    connect() {
        const path = process.env.REACT_APP_WEBSOCKET_URL

        this.socket = new WebSocket(path)

        this.socket.onopen = (event) => {
            console.log('onopen', event)
            this.socket.send(JSON.stringify({
                'authorization': `${localStorage.token}`
            }))
        }

        this.socket.onmessage = (event) => {
            console.log('onmessage', event)
            this._newMessage(event)
        }

        this.socket.onerror = (event) => {
            console.log('onerror', event)
        }

        this.socket.onclose = (event) => {
            console.log('onclose', event)
        }
    }

    _newMessage(event) {
        if (event) {
            this.newMessage = JSON.parse(event['data'])
        }
    }
}