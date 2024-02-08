const { run, client } = require("../../db/mongo");

const handleMessage = async (message, sender, date, roomId) => {
    const msg = {
        message: message,
        sender: sender,
        date: date,
        roomId: roomId,
    };

    try {
        await client.db("ChatApp").collection("Messages").insertOne(msg);
        console.log("Document was inserted successfully");
    } catch (e) {
        console.log("There was an error during the operation: " + e);
    }
};

module.exports = handleMessage;
