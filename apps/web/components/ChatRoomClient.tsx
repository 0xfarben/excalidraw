'use client';

import { useEffect, useState } from "react";
import { useSocket } from "../app/hooks/useSocket";

export function ChatRoomClient( { messages, id } : {
    messages: { message: string }[];
    id: string
}) {
    const [ chats, setChats ] = useState(messages);
    const [ currentMessage, setCurrentMessage ] = useState("");
    const { socket, loading } = useSocket();

    useEffect( () => {
        //  useSocket tells whether we are connected to ws server or not.

        // so, if connected, the send join request.
        if ( socket && !loading) {
            socket.send( JSON.stringify({
                type: "join_room",
                roomId: id
            }) );

            // if successfully joined, then listen for new messages ( onmessage handler ).
            // if msges; then update the chats state.
            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);

                if ( parsedData.type == "chat" )  {
                    setChats( prevChats => [ ...prevChats , {message: parsedData.message}])
                }
            }
        }
    } , [ socket, loading, id, chats ]);

    return <div>
        {chats.map( (m ) => <div>{m.message}</div> )}
        <input type="text"
                value={currentMessage}
                onChange={ (e) => setCurrentMessage(e.target.value)}
        ></input>

        <button
        onClick={ () => {
            socket?.send(JSON.stringify({
                type: "chat",
                roomId: id,
                message: currentMessage
            }))
            setCurrentMessage("");
        }}
        >Send Message</button>
    </div>
}