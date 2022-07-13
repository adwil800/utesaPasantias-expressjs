const express = require("express");
const router = express.Router({mergeParams: true});

const { addStudentSkill, removeStudentSkills, getStudentSkills, getSkillsByCareer, getStudentSkill } = require("../controllers/bemp");
const {protectRoute} = require("../controllers/auth");

router.route("/studentskill").post(protectRoute, addStudentSkill)
                             .get(protectRoute, getStudentSkill)
                             .delete(protectRoute, removeStudentSkills);

router.route("/studentskills").get(protectRoute, getStudentSkills);
router.route("/careerskills").get(protectRoute, getSkillsByCareer);


module.exports = router;




