const express = require("express");
const { createBooking,deleteBooking,verifyPayment } = require("../controllers/booking.controller.js");
const {verifyJwt} = require("../middleware/verifyJwt.js")
const {isAdmin} = require("../middleware/isAdmin.js")

const router = express.Router();

router.route("/eventBooking/:id").post(verifyJwt,createBooking);
router.route("/verifyPayment/:id").post(verifyJwt,verifyPayment);
router.route("/deleteBooking/:id").delete(verifyJwt,deleteBooking);


module.exports = router;