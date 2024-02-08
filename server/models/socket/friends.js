const { run, client } = require("../../db/mongo");

// není implementováno
const handleRemoveUserFromFriends = async (userId, friendId, roomId) => {
    let ObjectId = require("mongodb").ObjectId;

    try {
        // Remove 'friendId' from the user's 'friends' array
        await client
            .db("ChatApp")
            .collection("Users")
            .updateOne(
                { _id: new ObjectId(userId) },
                { $pull: { friends: friendId } }
            );

        // Remove 'userId' from the friend's 'friends' array
        await client
            .db("ChatApp")
            .collection("Users")
            .updateOne(
                { _id: new ObjectId(friendId) },
                { $pull: { friends: userId } }
            );

        await client
            .db("ChatApp")
            .collection("Rooms")
            .deleteOne({ _id: new ObjectId(roomId) });

        await client
            .db("ChatApp")
            .collection("Messages")
            .deleteMany({ roomId: roomId });

        console.log("User and friend removed from each other's friends list.");
    } catch (e) {
        console.error("There was an error during the operation: " + e);
    }
};

module.exports = handleRemoveUserFromFriends;
