import { useEffect, useState } from "react";

export default function useWait(waitMessage: string, completeMessage: string, delay: number) {
    const [message, setMessage] = useState(waitMessage);
    useEffect(() => {
        setMessage(waitMessage);
        var start = new Date().getTime();
        var end = start;
        // delay (ms)
        while(end < start + delay) {
          end = new Date().getTime();
        }
    setMessage(completeMessage);
    }, [waitMessage, completeMessage, delay]);
   return message;
 }