const express = require("express");
const { userRegistration,userLogin,userLogout,updateUser,changePassword } = require("../controllers/user.controller.js");
const {verifyJwt} = require("../middleware/verifyJwt.js")

const router = express.Router();

router.route("/register").post(userRegistration);
router.route("/login").post(userLogin);
router.route("/logout").post(verifyJwt,userLogout)
router.route("/updateUser").put(verifyJwt,updateUser)
router.route("/changePassword").put(verifyJwt,changePassword)

module.exports = router;
