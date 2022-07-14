const express = require("express");
const router = express.Router({mergeParams: true});

const { addStudentSkill, removeStudentSkills, getStudentSkills, getSkillsByCareer, getStudentSkill } = require("../controllers/bemp");

router.route("/studentskill").post(addStudentSkill)
                             .get(getStudentSkill)
                             .delete(removeStudentSkills);

router.route("/studentskills").get(getStudentSkills);
router.route("/careerskills").get(getSkillsByCareer);


module.exports = router;




