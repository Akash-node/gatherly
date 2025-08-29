const express = require("express");
const { eventCreation,updateEventDetails,deleteEvent,retreiveEvents,retreiveEventById,AllUserOfAEvent } = require("../controllers/event.controller.js");
const {verifyJwt} = require("../middleware/verifyJwt.js")
const {isAdmin} = require("../middleware/isAdmin.js")

const router = express.Router();

router.route("/createEvent").post(verifyJwt,isAdmin,eventCreation);
router.route("/updateEvent/:id").put(verifyJwt,isAdmin,updateEventDetails);
router.route("/deleteEvent/:id").delete(verifyJwt,isAdmin,deleteEvent);
router.route("/userList/:id").get(verifyJwt,AllUserOfAEvent);
router.route("/allEvent").get(retreiveEvents);
router.route("/:id").get(retreiveEventById);


module.exports = router;