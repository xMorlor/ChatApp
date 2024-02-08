const getUsers = () => {
    try {
        return fetch("/getUsers", {
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

const getUsersThatAreNotMyFriends = (users) => {
    try {
        return fetch("/getUsersThatAreNotMyFriends", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                users: users,
            }),
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

const getLoggedUserId = () => {
    try {
        return fetch("/getLoggedUserId", {
            method: "GET",
            credentials: "include",
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
    getUsers,
    getUsersThatAreNotMyFriends,
    getLoggedUserId,
};
