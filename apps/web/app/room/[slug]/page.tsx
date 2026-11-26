import axios from "axios";
import { BACKEND_URL, WS_URL } from "../../config";

async function getRoom( slug : string ) {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
    return response.data.id;
}

export default function ChatRoom( 
    {params} :
    { params: {
        roomId: string
    }}
)
{
    const roomId = params.roomId;
}