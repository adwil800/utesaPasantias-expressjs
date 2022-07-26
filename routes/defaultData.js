const express = require("express");
const router = express.Router({mergeParams: true});

const {pushEmployees, pushUsers, pushCampus, pushCareers, pushStudents, testRoute, pushSkills} = require("../controllers/defaultData");

router.route("/careers").get(pushCareers);      //1
router.route("/campus").get(pushCampus);        //2
router.route("/employees").get(pushEmployees);  //3
router.route("/students").get(pushStudents);    //4
router.route("/users").get(pushUsers);          //5
router.route("/skills").get(pushSkills);        //6

 
router.route("/test").post(testRoute);




module.exports = router;






