const express = require("express");
const router = express.Router();
const profileModel = require("../models/profile");

router.use(express.json());

router.post("/getProfile", profileModel.getProfile);
router.post("/updateProfile", profileModel.updateProfile);

module.exports = router;
