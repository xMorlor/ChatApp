const getMessages = (roomId) => {
    try {
        return fetch("/getMessages", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                roomId: roomId,
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
    getMessages,
};
