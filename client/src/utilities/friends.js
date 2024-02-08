const getFriends = () => {
    try {
        return fetch("/getFriends", {
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

module.exports = {
    getFriends,
};
