const express = require("express");
const router = express.Router();

router.use(express.json());

const userRoutes = require("./user");
const profileRoutes = require("./profile");
const friendsRoutes = require("./friends");
const friendRequestsRoutes = require("./friendRequests");
const sessionRoutes = require("./session");
const authenticationRoutes = require("./authentication");
const roomsRoutes = require("./rooms");
const messagesRoutes = require("./messages");
const groupChatRoutes = require("./groupChat");

router.use(userRoutes);
router.use(profileRoutes);
router.use(friendsRoutes);
router.use(friendRequestsRoutes);
router.use(sessionRoutes);
router.use(authenticationRoutes);
router.use(roomsRoutes);
router.use(messagesRoutes);
router.use(groupChatRoutes);

module.exports = router;
