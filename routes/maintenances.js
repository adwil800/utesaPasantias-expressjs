const express = require("express");
const router = express.Router({mergeParams: true});

const { getStudentCareer, addCareerSkill, removeCareerSkill, getAllCareers, getSkillsByCareer, getCompanyById } = require("../controllers/maintenances");

router.route("/studentcareer").get(getStudentCareer);

router.route("/careerskills").get(getSkillsByCareer)
                             .post(addCareerSkill)
                             .delete(removeCareerSkill);

router.route("/career").get(getAllCareers);                            
router.route("/company/filterid").get(getCompanyById);                            

module.exports = router;




