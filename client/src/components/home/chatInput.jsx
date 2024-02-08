import { sendIcon } from "../icons/icons";
import { sendMessage } from "../../utilities/socket/message";
import { useState, useRef } from "react";
import Css from "./chatInput.module.css";

function ChatInput({ sender, roomId, handleSentMessage }) {
    const [message, setMessage] = useState("");
    const ref = useRef(null);

    const handleMessage = () => {
        if (message.trim().length > 0) {
            const date = new Date().toLocaleString("en-GB", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
            });

            sendMessage(message, sender, date, roomId);

            let messageObject = {
                date: date,
                message: message,
                roomId: roomId,
                sender: sender,
            };

            handleSentMessage(messageObject);
            setMessage("");
            ref.current.value = "";
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleMessage();
        }
    };

    return (
        <div className={Css.wrapDiv}>
            <input
                type="text"
                className={`${Css.input} ${Css.searchInput}`}
                placeholder="Type a message here..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyPress={handleKeyPress}
                ref={ref}
            />
            <button className={Css.button} onClick={handleMessage}>
                {sendIcon}
            </button>
        </div>
    );
}

export default ChatInput;
