require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require("cors");
const sess = require("./sessionStorage/storage");
const { run } = require("./db/mongo");
const routes = require("./routes/index");

const handleRemoveUserFromFriends = require("./models/socket/friends");
const handleMessage = require("./models/socket/message");
const groupchatModel = require("./models/socket/groupChat");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.use(
    cors({
        origin: "https://chatapp-7149.rostiapp.cz",
        methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
        credentials: true,
    })
);

app.use(sess);

app.use(routes);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

run().catch(console.dir);
io.on("connection", (socket) => {
    socket.on("join-room", (roomName) => {
        socket.join(roomName);
    });

    socket.on("leave-room", (roomName) => {
        socket.leave(roomName);
    });

    socket.on("disconnect", () => {});

    socket.on("chat-message", (data) => {
        const { message, sender, date, roomId } = data;
        handleMessage(message, sender, date, roomId);

        socket.broadcast
            .to(roomId)
            .emit("received-message", { message, sender, date, roomId });
    });

    // groupchat
    socket.on("change-of-groupchat-name", (data) => {
        const { name, roomId } = data;
        groupchatModel.handleChangedName(name, roomId);

        socket.broadcast
            .to(roomId)
            .emit("changed-groupchat-name", { name, roomId });
    });

    socket.on("change-of-groupchat-profilePicture", (data) => {
        const { profilePicture, roomId } = data;
        groupchatModel.handleChangedProfilePicture(profilePicture, roomId);

        socket.broadcast.to(roomId).emit("change-of-groupchat-profilePicture", {
            profilePicture,
            roomId,
        });
    });

    socket.on("add-users-to-groupchat", (data) => {
        const { groupchatId, users } = data;
        groupchatModel.handleAddUsersToGroupchat(groupchatId, users);

        socket.broadcast.to(groupchatId).emit("change-of-groupchat-users", {
            users,
        });
    });
});

server.listen(8080, () => {
    console.log("Listening");
});
