import { socket } from "../../socket.js";

export const joinRoom = (roomName) => {
    try {
        socket.emit("join-room", roomName);
    } catch (e) {
        console.error(e);
    }
};

export const leaveRoom = (roomName) => {
    try {
        socket.emit("leave-room", roomName);
    } catch (e) {
        console.error(e);
    }
};
