import axios from "axios";
import { BACKEND_URL } from "../app/config";
import { ChatRoomClient } from "./ChatRoomClient";

async function getChats( roomId: string) {

    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    // "messages": [
    //     {
    //         "id": 23,
    //         "message": "im nidith",
    //         "userId": "485bb88a-ea6d",
    //         "roomId": 8
    //     },
    //     {
    //         "id": 22,
    //         "message": "hi",
    //         "userId": "d1568432-a538",
    //         "roomId": 8
    //     },
    // console.log("---------");
    // console.log(response.data);
    // console.log("---------");
    return response.data.messages;
}

export async function ChatRoom( {id} : { id: string}){
    // console.log("---------");
    // console.log("roomId: ", id);
    // console.log("---------");
    const messages = await getChats(id);
    return <ChatRoomClient key={id} id={id} messages={messages}></ChatRoomClient>;
} 