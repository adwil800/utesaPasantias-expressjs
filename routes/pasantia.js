const express = require("express");
const router = express.Router({mergeParams: true});

const {requestPasantia, getStudentInformation, updateStudentBemp, updateStudentTpasantia} = require("../controllers/pasantia");

router.route("/request").post(requestPasantia);

router.route("/getstudent").get(getStudentInformation);
router.route("/updatebemp").put(updateStudentBemp);
router.route("/updatetpasantia").put(updateStudentTpasantia);


module.exports = router;