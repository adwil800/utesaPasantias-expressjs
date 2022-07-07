const express = require("express");
const router = express.Router({mergeParams: true});

const {pushEmployees, pushUsers} = require("../controllers/defaultData");

router.route("/employees").post(pushEmployees);
router.route("/users").post(pushUsers);


module.exports = router;






