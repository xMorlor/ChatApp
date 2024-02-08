const express = require("express");
const router = express.Router();
const friendsModels = require("../models/friendRequests");

router.use(express.json());

router.get("/getFriendRequests", friendsModels.getFriendRequests);
router.post("/sendFriendRequest", friendsModels.sendFriendRequest);
router.post("/acceptFriendRequest", friendsModels.acceptFriendRequest);
router.post("/declineFriendRequest", friendsModels.declineFriendRequest);

module.exports = router;
