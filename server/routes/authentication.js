const express = require("express");
const router = express.Router();
const authenticationModel = require("../models/authentication");

router.use(express.json());

router.post("/login", authenticationModel.userLogin);
router.post("/register", authenticationModel.userRegister);
router.get("/logOut", authenticationModel.logOut);

module.exports = router;
