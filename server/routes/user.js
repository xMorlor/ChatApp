const express = require("express");
const router = express.Router();
const userModels = require("../models/user");

router.use(express.json());

router.get("/getLoggedUserId", userModels.getLoggedUserId);
router.get("/getUsers", userModels.getUsers);
router.post(
    "/getUsersThatAreNotMyFriends",
    userModels.getUsersThatAreNotMyFriends
);

module.exports = router;
