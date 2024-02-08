import { socket } from "../../socket.js";

export const removeUserFromFriends = (userId, friendId, roomId) => {
    try {
        socket.emit("remove-user-from-friends", {
            userId,
            friendId,
            roomId,
        });
    } catch (error) {
        console.error(error);
    }
};
