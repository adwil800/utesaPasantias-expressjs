const express = require("express");
const router = express.Router({mergeParams: true});


const {login, logout, getMe, protectRoute} = require("../controllers/auth");
const sessionChecker = require("../middleware/sessionChecker");


router.route("/login").post(login);
router.route("/logout").get(sessionChecker, protectRoute, logout);
router.route("/getme").get(sessionChecker, protectRoute, getMe);




module.exports = router;








