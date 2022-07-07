const express = require("express");
const router = express.Router({mergeParams: true});

const {pushCompany} = require("../controllers/bemp");

router.route("/company").post(pushCompany);



module.exports = router;