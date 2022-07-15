const express = require("express");
const router = express.Router({mergeParams: true});

const {requestPasantia, getStudentInformation, updateStudentBemp, updateStudentTpasantia, updateRequestPasantia, getStudentRequest, getStudentRequestStatus} = require("../controllers/pasantia");

router.route("/request").get(getStudentRequest).post(requestPasantia).put(updateRequestPasantia);
router.route("/requeststatus").get(getStudentRequestStatus);

router.route("/getstudent").get(getStudentInformation);
router.route("/updatebemp").put(updateStudentBemp);
router.route("/updatetpasantia").put(updateStudentTpasantia);


module.exports = router;