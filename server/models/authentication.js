const { run, client } = require("../db/mongo");
const bcrypt = require("bcrypt");
const validateUser = require("../validation/user");

const userRegister = async (req, res) => {
    let validation = validateUser.validateRegisterUser(req.body.user);

    if (validation) {
        res.send("Invalid data");
    } else {
        try {
            const existingUser = await client
                .db("ChatApp")
                .collection("Users")
                .findOne({ username: req.body.user.username });

            if (existingUser) {
                res.send("Username is already taken");
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(
                    req.body.user.password,
                    salt
                );

                const user = {
                    username: req.body.user.username,
                    password: hashedPassword,
                    friends: [],
                    friendRequests: [],
                    bio: "",
                    location: {
                        country: "",
                        town: "",
                    },
                    profilePicture: "",
                };

                const result = await client
                    .db("ChatApp")
                    .collection("Users")
                    .insertOne(user);

                req.session.user = {
                    id: result.insertedId,
                    name: user.username,
                    friends: user.friends,
                    friendRequests: user.friendRequests,
                };

                res.send("Success");
            }
        } catch (e) {
            res.send("Error during the operation");
        }
    }
};

const userLogin = async (req, res) => {
    let validation = validateUser.validateGetUser(req.body.user);

    if (validation) {
        res.send("Invalid data");
    } else {
        try {
            const user = await client
                .db("ChatApp")
                .collection("Users")
                .findOne({ username: req.body.user.username });

            if (user !== null) {
                const correctPassword = await bcrypt.compare(
                    req.body.user.password,
                    user.password
                );

                if (correctPassword) {
                    req.session.user = {
                        id: user._id,
                        name: user.username,
                        friends: user.friends,
                        friendRequests: user.friendRequests,
                    };
                    res.send("Success");
                } else {
                    res.send("Wrong password");
                }
            } else {
                res.send("User is not registered");
            }
        } catch (error) {
            res.send("Error");
        }
    }
};

const logOut = async (req, res) => {
    try {
        await req.session.destroy();
        res.send("Success");
    } catch {
        res.send("There was en error during the operation");
    }
};

module.exports = {
    userRegister,
    userLogin,
    logOut,
};
