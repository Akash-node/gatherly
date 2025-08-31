const express = require("express");
const { createBooking,verifyPayment,userAlreadyRegisterOrNot } = require("../controllers/booking.controller.js");
const {verifyJwt} = require("../middleware/verifyJwt.js")
const {isAdmin} = require("../middleware/isAdmin.js")

const router = express.Router();

router.route("/eventBooking/:id").post(verifyJwt,createBooking);
router.route("/verifyPayment/:id").post(verifyJwt,verifyPayment);
router.route("/alreadyRegister/:id").get(verifyJwt,userAlreadyRegisterOrNot);



module.exports = router;