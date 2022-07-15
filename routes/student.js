const express = require("express");
const router = express.Router({mergeParams: true});

const { getCareer } = require("../controllers/student");

router.route("/career").get(getCareer);


module.exports = router;




