const express = require("express");
const router = express.Router({mergeParams: true});

const {requestPasantia, getStudentInformation, updateStudentBemp, updateStudentTpasantia} = require("../controllers/pasantia");
const {protectRoute} = require("../controllers/auth");

router.route("/request").post(protectRoute, requestPasantia);

router.route("/getstudent").get(protectRoute, getStudentInformation);
router.route("/updatebemp").put(protectRoute, updateStudentBemp);
router.route("/updatetpasantia").put(protectRoute, updateStudentTpasantia);


module.exports = router;