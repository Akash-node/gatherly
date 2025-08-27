const express = require("express");
const { fetchEventByUserId , deleteEventById } = require("../controllers/profile.controller.js");
const {verifyJwt} = require("../middleware/verifyJwt.js")
const {isAdmin} = require("../middleware/isAdmin.js")

const router = express.Router();

router.route("/:userId").get(verifyJwt,fetchEventByUserId);
router.route("/:eventId").delete(verifyJwt,isAdmin,deleteEventById);


module.exports = router;