const { run, client } = require("../db/mongo");

const getMessages = async (req, res) => {
    try {
        const messages = await client
            .db("ChatApp")
            .collection("Messages")
            .find({ roomId: req.body.roomId })
            .toArray();

        res.send(messages);
    } catch (e) {
        res.send("Error during the operation");
    }
};

module.exports = {
    getMessages,
};
