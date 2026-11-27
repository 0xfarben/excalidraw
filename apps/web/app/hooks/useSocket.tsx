
import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket() {
    const [ loading, setLoading ] = useState(true) ;

    const [ socket, setSocket ] = useState<WebSocket | null>(null);

    useEffect( () => {
        // connect to the ws server
        const ws = new WebSocket(`${WS_URL}?token=passing-the-token-here-for-testing-purpose`);
        // token will be managed securely while further development.
        ws.onopen= () => {
            setLoading(false);
            setSocket(ws);
        }
    }, [])

    return {
        socket, loading
    } 
}