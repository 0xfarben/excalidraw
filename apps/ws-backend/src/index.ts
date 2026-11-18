import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { WS_PORT, JWT_SECRET } from "@repo/backend-common/config"

const wss = new WebSocketServer({
    port: Number(WS_PORT)
})

wss.on('connection', function connection(ws, request) {
    // Only authenticated users can enter the websocket server.
    // so verify the jwt token.
    // ws://localhost:8080?token=121313
    const url = request.url;
    // url = ["ws://localhost:8080"  ,  "token=121313"]

    if( !url ) {
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";

    const decoded = jwt.verify(token, JWT_SECRET);

    if ( typeof decoded == "string") {
        ws.close();
        return;
    }
    if ( !decoded || !(decoded as JwtPayload).userId ) {
        ws.close();
        return;
    }

    ws.on('message', function message() {
        ws.send('PONG');
    });

})