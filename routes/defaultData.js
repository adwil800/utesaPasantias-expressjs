const express = require("express");
const router = express.Router({mergeParams: true});

const {pushEmployees, pushUsers, pushCampus, pushCareers, pushStudents, testRoute, pushSkills} = require("../controllers/defaultData");

router.route("/careers").all(pushCareers);      //1
router.route("/campus").all(pushCampus);        //2
router.route("/employees").all(pushEmployees);  //3
router.route("/students").all(pushStudents);    //4
router.route("/users").all(pushUsers);          //5
router.route("/skills").all(pushSkills);        //6

 
router.route("/test").post(testRoute);


// /api/default

module.exports = router;






