const express = require("express");
const router = express.Router({mergeParams: true});

const {pushEmployees, pushUsers, pushCampus, pushCareers, pushStudents} = require("../controllers/defaultData");

router.route("/employees").post(pushEmployees);
router.route("/users").post(pushUsers);
router.route("/campus").post(pushCampus);
router.route("/careers").post(pushCareers);
router.route("/students").post(pushStudents);



module.exports = router;






