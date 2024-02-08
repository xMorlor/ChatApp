import { socket } from "../../socket.js";

export const changeOfGroupchatName = (name, roomId) => {
    try {
        socket.emit("change-of-groupchat-name", { name, roomId });
    } catch (error) {
        console.error("Error in changeOfGroupchatName:", error);
    }
};

export const changeOfGroupchatProfilePicture = (profilePicture, roomId) => {
    try {
        socket.emit("change-of-groupchat-profilePicture", {
            profilePicture,
            roomId,
        });
    } catch (error) {
        console.error("Error in changeOfGroupchatProfilePicture:", error);
    }
};

export const leaveGroupchat = (groupchatId, userId) => {
    try {
        socket.emit("leave-groupchat", { groupchatId, userId });
    } catch (error) {
        console.error("Error in leaveGroupchat:", error);
    }
};

export const addUsersToGroupchat = (groupchatId, users) => {
    try {
        socket.emit("add-users-to-groupchat", { groupchatId, users });
    } catch (error) {
        console.error("Error in addUsersToGroupchat:", error);
    }
};
