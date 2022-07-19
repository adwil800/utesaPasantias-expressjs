const express = require("express");
const router = express.Router({mergeParams: true});


const {login, logout, getMe, getCampus, protectRoute} = require("../controllers/auth");


router.route("/login").post(login);
router.route("/logout").get(protectRoute, logout);
router.route("/getme").get(protectRoute, getMe);

router.route("/getcampus").get(getCampus);



module.exports = router;








