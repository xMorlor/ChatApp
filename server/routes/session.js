const express = require("express");
const router = express.Router();
const sessionModel = require("../models/session");

router.use(express.json());

router.get("/checkSession", sessionModel.checkSession);

module.exports = router;
