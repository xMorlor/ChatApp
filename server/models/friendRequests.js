const { run, client } = require("../db/mongo");

const getFriendRequests = async (req, res) => {
    var ObjectId = require("mongodb").ObjectId;

    try {
        const currentUser = new ObjectId(req.session.user.id);

        const user = await client
            .db("ChatApp")
            .collection("Users")
            .findOne({ _id: currentUser });
        const friendRequests = user.friendRequests.map(
            (user) => new ObjectId(user)
        );

        // je potřeba updatnout friendRequesty v session, ta je totiž inicializovaná při loginu a poté se nemění, takže do ní musíme přidat nové requesty zde
        user.friendRequests.forEach((request) => {
            if (!req.session.user.friendRequests.includes(request)) {
                req.session.user.friendRequests.push(request);
            }
        });

        //returns cursor
        const cursor = await client
            .db("ChatApp")
            .collection("Users")
            .find({ _id: { $in: friendRequests } });

        const arrayOfFriendRequests = await cursor.toArray();
        res.json(arrayOfFriendRequests);
    } catch (e) {
        //res.json("Error during the operation");
    }
};

const sendFriendRequest = async (req, res) => {
    var ObjectId = require("mongodb").ObjectId;

    try {
        const user = await client
            .db("ChatApp")
            .collection("Users")
            .findOneAndUpdate(
                { _id: new ObjectId(req.body.id) },
                { $push: { friendRequests: req.session.user.id } }
            );
        res.send("Success");
    } catch (e) {
        res.send("Error during the operation");
    }
};

const acceptFriendRequest = async (req, res) => {
    var ObjectId = require("mongodb").ObjectId;

    try {
        const operations = [
            {
                updateOne: {
                    filter: { _id: new ObjectId(req.session.user.id) },
                    update: {
                        $push: { friends: req.body.id },
                        $pull: { friendRequests: req.body.id },
                    },
                },
            },
            {
                updateOne: {
                    filter: { _id: new ObjectId(req.body.id) },
                    update: { $push: { friends: req.session.user.id } },
                },
            },
        ];

        req.session.user.friendRequests =
            req.session.user.friendRequests.filter(
                (request) => request !== req.body.id
            );

        req.session.user.friends.push(req.body.id);

        await client.db("ChatApp").collection("Users").bulkWrite(operations);

        res.send("Success");
    } catch (e) {
        res.send("Error during the operation");
    }
};

const declineFriendRequest = async (req, res) => {
    var ObjectId = require("mongodb").ObjectId;

    try {
        await client
            .db("ChatApp")
            .collection("Users")
            .updateOne(
                { _id: new ObjectId(req.session.user.id) },
                { $pull: { friendRequests: req.body.id } }
            );

        req.session.user.friendRequests =
            req.session.user.friendRequests.filter(
                (request) => request !== req.body.id
            );

        res.send("Success");
    } catch (e) {
        res.send("Error during the operation");
    }
};

module.exports = {
    getFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
};
