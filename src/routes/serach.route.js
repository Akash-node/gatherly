const express = require("express");
const { SearchEvents } = require("../controllers/serach.controller.js");
const {verifyJwt} = require("../middleware/verifyJwt.js")

const router = express.Router();

router.route("/events").get(verifyJwt, SearchEvents);

module.exports = router;