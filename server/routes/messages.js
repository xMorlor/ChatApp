const express = require("express");
const router = express.Router();
const messagesModel = require("../models/messages");

router.use(express.json());

router.post("/getMessages", messagesModel.getMessages);

module.exports = router;
