import { socket } from "../../socket.js";

export const sendMessage = (message, sender, date, roomId) => {
    try {
        socket.emit("chat-message", { message, sender, date, roomId });
    } catch (e) {
        console.error(e);
    }
};
