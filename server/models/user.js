const { run, client } = require("../db/mongo");

const getUsers = async (req, res) => {
    let ObjectId = require("mongodb").ObjectId;

    try {
        let friendsAndUser = req.session.user.friends;
        const currentUser = new ObjectId(req.session.user.id);

        friendsAndUser = friendsAndUser.map((user) => new ObjectId(user));

        friendsAndUser.includes(new ObjectId(req.session.user.id))
            ? null
            : friendsAndUser.push(new ObjectId(req.session.user.id));

        const user = await client
            .db("ChatApp")
            .collection("Users")
            .findOne({ _id: currentUser });

        req.session.user.friends = user.friends;

        // je potřeba updatnout friendRequesty v session, ta je totiž inicializovaná při loginu či registraci a poté se nemění, takže do ní musíme přidat nové requesty zde
        user.friendRequests.forEach((request) => {
            if (!req.session.user.friendRequests.includes(request)) {
                req.session.user.friendRequests.push(request);
            }
        });

        //returns cursor
        const cursor = await client
            .db("ChatApp")
            .collection("Users")
            .find({ _id: { $nin: friendsAndUser } }); //$nin = not in

        const users = await cursor.toArray();

        let filteredUsers = users.filter(
            (user) => !user.friendRequests.includes(req.session.user.id)
        );

        filteredUsers = filteredUsers.filter(
            (user) =>
                !req.session.user.friendRequests.includes(user._id.toString())
        );

        filteredUsers = filteredUsers.filter(
            (user) => !req.session.user.friends.includes(user._id.toString())
        );

        res.json(filteredUsers);
    } catch (e) {
        console.error("Error during the operation:", e);

        // Send an error response with a status code
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getUsersThatAreNotMyFriends = async (req, res) => {
    let ObjectId = require("mongodb").ObjectId;

    try {
        let users = req.body.users.map((user) => new ObjectId(user));

        const cursor = await client
            .db("ChatApp")
            .collection("Users")
            .find({ _id: { $in: users } });

        const response = await cursor.toArray();

        res.json(response);
    } catch (e) {
        console.error("Error during the operation:", e);

        // Send an error response with a status code
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getLoggedUserId = async (req, res) => {
    try {
        res.send(req.session.user.id);
    } catch (e) {
        res.send("Error during the operation");
    }
};

module.exports = {
    getUsers,
    getUsersThatAreNotMyFriends,
    getLoggedUserId,
};
