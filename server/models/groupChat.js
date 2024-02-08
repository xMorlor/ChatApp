const { run, client } = require("../db/mongo");
const { ObjectId } = require("mongodb");

const createGroupChat = async (req, res) => {
    try {
        let users = req.body.users.map((user) => new ObjectId(user));

        const room = {
            users: users,
            name: req.session.user.name + "'s room",
        };

        const result = await client
            .db("ChatApp")
            .collection("Rooms")
            .insertOne(room);

        let roomId = result.insertedId.toString();

        res.json({
            isGroupchat: true,
            roomId: roomId,
            roomName: room.name,
            roomProfilePicture: undefined,
            roomUsers: req.body.users,
        });
    } catch (e) {
        res.json({ error: "Error during the operation" });
    }
};

module.exports = {
    createGroupChat,
};
