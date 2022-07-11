const express = require("express");
const router = express.Router({mergeParams: true});

const {requestPasantia, getStudentInformation} = require("../controllers/pasantia");
const {protectRoute} = require("../controllers/auth");

router.route("/request").post(protectRoute, requestPasantia);

router.route("/getstudent").get(protectRoute, getStudentInformation);

module.exports = router;