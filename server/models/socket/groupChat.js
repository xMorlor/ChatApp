const { run, client } = require("../../db/mongo");

const handleChangedName = async (name, roomId) => {
    let ObjectId = require("mongodb").ObjectId;

    try {
        await client
            .db("ChatApp")
            .collection("Rooms")
            .updateOne({ _id: new ObjectId(roomId) }, { $set: { name: name } });
        console.log("Document was updated successfully");
    } catch (e) {
        console.log("There was an error during the operation: " + e);
    }
};

const handleChangedProfilePicture = async (profilePicture, roomId) => {
    let ObjectId = require("mongodb").ObjectId;

    try {
        await client
            .db("ChatApp")
            .collection("Rooms")
            .updateOne(
                { _id: new ObjectId(roomId) },
                { $set: { groupChatProfilePicture: profilePicture } }
            );
        console.log("Document was updated successfully");
    } catch (e) {
        console.log("There was an error during the operation: " + e);
    }
};

// není implementováno
const handleLeaveGroupchat = async (groupchatId, userId) => {
    let ObjectId = require("mongodb").ObjectId;

    try {
        await client
            .db("ChatApp")
            .collection("Rooms")
            .updateOne(
                { _id: new ObjectId(groupchatId) },
                { $pull: { users: new ObjectId(userId) } }
            );
        console.log("Document was updated successfully");
    } catch (e) {
        console.log("There was an error during the operation: " + e);
    }
};

const handleAddUsersToGroupchat = async (groupchatId, users) => {
    let ObjectId = require("mongodb").ObjectId;

    const userIds = [];
    users.forEach((user) => userIds.push(new ObjectId(user.userId)));

    try {
        await client
            .db("ChatApp")
            .collection("Rooms")
            .updateOne(
                { _id: new ObjectId(groupchatId) },
                { $push: { users: { $each: userIds } } }
            );
        console.log("Document was updated successfully");
    } catch (e) {
        console.log("There was an error during the operation: " + e);
    }
};

module.exports = {
    handleChangedName,
    handleChangedProfilePicture,
    handleLeaveGroupchat,
    handleAddUsersToGroupchat,
};
