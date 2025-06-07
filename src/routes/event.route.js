const express = require("express");
const { eventCreation,updateEventDetails,deleteEvent } = require("../controllers/event.controller.js");
const {verifyJwt} = require("../middleware/verifyJwt.js")
const {isAdmin} = require("../middleware/isAdmin.js")

const router = express.Router();

router.route("/createEvent").post(verifyJwt,eventCreation);
router.route("/updateEvent/:id").put(verifyJwt,isAdmin,updateEventDetails);
router.route("/deleteEvent/:id").delete(verifyJwt,isAdmin,deleteEvent);

module.exports = router;