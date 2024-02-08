const { run, client } = require("../db/mongo");

const getProfile = async (req, res) => {
    let ObjectId = require("mongodb").ObjectId;

    try {
        let currentProfile;
        if (req.body.id) {
            currentProfile = new ObjectId(req.body.id);
        } else {
            currentProfile = new ObjectId(req.session.user.id);
        }

        const profile = await client
            .db("ChatApp")
            .collection("Users")
            .findOne({ _id: currentProfile });

        const friendIds = profile.friends.map((id) => new ObjectId(id));
        const cursor = await client
            .db("ChatApp")
            .collection("Users")
            .find({ _id: { $in: friendIds } });

        const profileAndFriends = {
            profile: profile,
            friends: await cursor.toArray(),
        };

        res.json(profileAndFriends);
    } catch (e) {
        console.error("Error during the operation:", e);

        // Send an error response with a status code
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateProfile = async (req, res) => {
    let ObjectId = require("mongodb").ObjectId;

    try {
        await client
            .db("ChatApp")
            .collection("Users")
            .updateOne(
                { _id: new ObjectId(req.session.user.id) },
                {
                    $set: {
                        username: req.body.username,
                        bio: req.body.bio,
                        "location.country": req.body.country,
                        "location.town": req.body.town,
                        profilePicture: req.body.profilePicture,
                    },
                }
            );

        res.send("Success");
    } catch (e) {
        res.send("Error during the operation");
    }
};

module.exports = {
    getProfile,
    updateProfile,
};
