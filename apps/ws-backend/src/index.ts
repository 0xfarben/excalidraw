import { WebSocketServer } from "ws";

const WS_PORT = 8081;

const wss = new WebSocketServer({
    port: WS_PORT
})

wss.on('connection', function connection(ws) {

    ws.on('message', function message() {
        ws.send('PONG');
    });

})