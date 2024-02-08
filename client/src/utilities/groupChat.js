const createGroupChat = (users) => {
    try {
        return fetch("/createGroupChat", {
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

module.exports = {
    createGroupChat,
};
