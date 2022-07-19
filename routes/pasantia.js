const express = require("express");
const router = express.Router({mergeParams: true});

const {requestNoBempPasantia, removeStudentBemp, getStudentInformation, updateStudentBemp, updateStudentTpasantia, updateRequestNoBempPasantia, getStudentNoBempRequest, getStudentRequestStatus, updateRequestBempPasantia, requestBempPasantia, getStudentBempRequest} = require("../controllers/pasantia");

router.route("/request").get(getStudentNoBempRequest)
                        .post(requestNoBempPasantia)
                        .put(updateRequestNoBempPasantia);
router.route("/requestbemp").get(getStudentBempRequest)
                            .post(requestBempPasantia)
                            .put(updateRequestBempPasantia);

router.route("/requeststatus").get(getStudentRequestStatus);

router.route("/getstudent").get(getStudentInformation);

router.route("/updatebemp").put(updateStudentBemp);
router.route("/removebemp").put(removeStudentBemp);

router.route("/updatetpasantia").put(updateStudentTpasantia);


module.exports = router;