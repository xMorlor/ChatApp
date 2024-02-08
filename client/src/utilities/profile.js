const getProfile = (id) => {
    try {
        return fetch("/getProfile", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                id: id,
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

const updateProfile = (username, country, town, bio, profilePicture) => {
    try {
        fetch("/updateProfile", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                username: username,
                country: country,
                town: town,
                bio: bio,
                profilePicture: profilePicture,
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
    getProfile,
    updateProfile,
};
