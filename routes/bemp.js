const express = require("express");
const router = express.Router({mergeParams: true});

const { addStudentSkill, removeStudentSkills, getStudentSkills, getStudentSkill, 
        updateBempCompany, addBempCompany, getBempCompanies, getBempStudent,
        addCompanyVacant, getCompanyVacants, updateCompanyVacant, addVacantSkill,
        removeVacantSkill, getVacantSkills, getVacantsByCampusCareer} = require("../controllers/bemp");

router.route("/studentskill").get(getStudentSkill)
                            .post(addStudentSkill)
                            .delete(removeStudentSkills);

router.route("/studentskills").get(getStudentSkills);

router.route("/company").get(getBempCompanies)
                        .post(addBempCompany)
                        .put(updateBempCompany);

router.route("/vacants").get(getCompanyVacants)
                        .post(addCompanyVacant)
                        .put(updateCompanyVacant);
                        
router.route("/vacants/vacantskills").get(getVacantSkills)
                                     .post(addVacantSkill)
                                     .delete(removeVacantSkill);

//Vacant assignation
router.route("/vacants/filtered").get(getVacantsByCampusCareer);
router.route("/bempstudent").get(getBempStudent);


module.exports = router;




