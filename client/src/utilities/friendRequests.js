const getFriendRequests = () => {
    try {
        return fetch("/getFriendRequests", {
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

const sendFriendRequest = (id) => {
    try {
        fetch("/sendFriendRequest", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                id: id,
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.text())
            .then((result) => {
                console.log(result);
            });
    } catch (e) {
        console.error(e);
    }
};

const acceptFriendRequest = (id) => {
    try {
        fetch("/acceptFriendRequest", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                id: id,
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.text())
            .then((result) => {
                console.log(result);
            });
    } catch (e) {
        console.error(e);
    }
};

const declineFriendRequest = (id) => {
    try {
        fetch("/declineFriendRequest", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                id: id,
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.text())
            .then((result) => {
                console.log(result);
            });
    } catch (e) {
        console.error(e);
    }
};

module.exports = {
    getFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
};
