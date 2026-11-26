import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { WS_PORT, JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/client";

const wss = new WebSocketServer({
    port: Number(WS_PORT)
})

// const users = [{
//         userId: 1,
//         rooms: [ "room1", "room2", "room3" ],
//         ws: socketObject
//     }, {
//         userId: 2,
//         rooms: [ "room1", "room2", "room3" ],
//         ws: socketObject
//     },
// ]

interface User {
    userId: string,
    rooms: string[],
    ws: WebSocket
}

const users: User[] = [];

function checkUser(token: string) : string | null {
    try {

        const decoded = jwt.verify(token, JWT_SECRET);
        
        if ( typeof decoded == "string") {
            return null;
        }
        if ( !decoded || !(decoded as JwtPayload).userId ) {
            return null;
        }

        return decoded.userId;
    } catch(e) {
        return null;
    }
}

wss.on('connection', function connection(ws, request) {
    // Only authenticated users can enter the websocket server.
    // so verify the jwt token.
    const url = request.url;
    
    if( !url ) {
        return;
    }
    
    // ws://localhost:8080?token=eysdjsdsjdsjd
    // url = ["ws://localhost:8080"  ,  "token=eysdjsdsjdsjd"]
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = checkUser(token);
    
    if( userId == null ) {
        ws.close();
        return null;
    }

    users.push({
        userId, 
        rooms: [], 
        ws
    }) 

    ws.on('message', async function message(data) {
        // console.log(`WS Object: ${ws}`)
        const parsedData = JSON.parse(data as unknown as string); // { type: "join_room", roomId: 1 }

        if (parsedData.type === "join_room") {
            const user = users.find(x => x.ws === ws);
            user?.rooms.push(parsedData.roomId);
        }
        
        if ( parsedData.type === "leave_room" ) {
            const user = users.find(x => x.ws === ws);
            if( !user ) {
                return;
            }
            user.rooms = user?.rooms.filter( x => x === parsedData.room );
        }

        if ( parsedData.type === "chat" ) {
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            // save the chats inside the db.
            // in real-world, DB save will be done using Queues,.

            await prisma.chat.create({
                data: {
                    roomId,
                    message,
                    userId
                }
            })

            users.forEach( user => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        roomId,
                        message: message
                    }))
                }
            })
        }
    });

})