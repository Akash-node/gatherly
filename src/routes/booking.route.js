const express = require("express");
const { createBooking,deleteBooking } = require("../controllers/booking.controller.js");
const {verifyJwt} = require("../middleware/verifyJwt.js")
const {isAdmin} = require("../middleware/isAdmin.js")

const router = express.Router();

router.route("/eventBooking/:id").post(verifyJwt,createBooking);
router.route("/deleteBooking/:id").post(verifyJwt,deleteBooking);


module.exports = router;