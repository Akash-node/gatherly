const express = require("express");
const { fetchEventByUserId , deleteEventById, fetchTotalEventAUserRegister } = require("../controllers/profile.controller.js");
const {verifyJwt} = require("../middleware/verifyJwt.js")
const {isAdmin} = require("../middleware/isAdmin.js")

const router = express.Router();

router.route("/totalCreatedEvent").get(verifyJwt,fetchEventByUserId);
router.route("/:eventId").delete(verifyJwt,isAdmin,deleteEventById);
router.route("/totalRegisterEvent").get(verifyJwt,fetchTotalEventAUserRegister);


module.exports = router;