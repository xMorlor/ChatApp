const getRooms = () => {
    try {
        return fetch("/getRooms", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((result) => {
                return result;
            });
    } catch (e) {
        console.error(e);
    }
};

const createRoom = (users, name, isGroupChat) => {
    try {
        return fetch("/createRoom", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                users: users,
                name: isGroupChat ? name : "friends room",
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.text())
            .then((result) => {
                return result;
            });
    } catch (e) {
        console.error(e);
    }
};

module.exports = {
    getRooms,
    createRoom,
};
