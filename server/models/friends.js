const { run, client } = require("../db/mongo");

const getFriends = async (req, res) => {
    var ObjectId = require("mongodb").ObjectId;

    try {
        const currentUser = new ObjectId(req.session.user.id);

        const user = await client
            .db("ChatApp")
            .collection("Users")
            .findOne({ _id: currentUser });
        const friends = user.friends.map((user) => new ObjectId(user));

        //returns cursor
        const cursor = await client
            .db("ChatApp")
            .collection("Users")
            .find({ _id: { $in: friends } });

        const arrayOfFriends = await cursor.toArray();

        let currentUserId = req.session.user.id;

        res.json({ arrayOfFriends, currentUserId });
    } catch (e) {
        console.error("Error during the operation:", e);

        // Send an error response with a status code
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    getFriends,
};
