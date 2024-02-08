const express = require("express");
const router = express.Router();
const friendsModels = require("../models/friends");

router.use(express.json());

router.get("/getFriends", friendsModels.getFriends);

module.exports = router;
