const { run, client } = require("../db/mongo");

const getRooms = async (req, res) => {
    let ObjectId = require("mongodb").ObjectId;

    try {
        const cursor = await client
            .db("ChatApp")
            .collection("Rooms")
            .find({ users: new ObjectId(req.session.user.id) });

        const rooms = await cursor.toArray();

        res.json(rooms);
    } catch (e) {
        console.error("Error during the operation:", e);

        // Send an error response with a status code
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const createRoom = async (req, res) => {
    var ObjectId = require("mongodb").ObjectId;

    try {
        let users = req.body.users.map((user) => new ObjectId(user));
        users.push(new ObjectId(req.session.user.id));

        const room = {
            users: users,
            name: req.body.name,
        };

        await client.db("ChatApp").collection("Rooms").insertOne(room);

        res.send("success");
    } catch (e) {
        res.send("Error during the operation");
    }
};

module.exports = {
    getRooms,
    createRoom,
};
