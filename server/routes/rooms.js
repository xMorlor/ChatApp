const express = require("express");
const router = express.Router();
const roomsModel = require("../models/rooms");

router.use(express.json());

router.get("/getRooms", roomsModel.getRooms);
router.post("/createRoom", roomsModel.createRoom);

module.exports = router;
