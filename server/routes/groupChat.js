const express = require("express");
const router = express.Router();
const groupChatModel = require("../models/groupChat");

router.use(express.json());

router.post("/createGroupChat", groupChatModel.createGroupChat);

module.exports = router;
