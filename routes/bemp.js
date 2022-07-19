const express = require("express");
const router = express.Router({mergeParams: true});

const { addStudentSkill, removeStudentSkills, getStudentSkills, getStudentSkill, 
        updateBempCompany, addBempCompany, getBempCompanyData,
        addCompanyVacant, getCompanyVacants, updateCompanyVacant,
        addVacantSkill, removeVacantSkill, getVacantSkills} = require("../controllers/bemp");

router.route("/studentskill").get(getStudentSkill)
                            .post(addStudentSkill)
                            .delete(removeStudentSkills);

router.route("/studentskills").get(getStudentSkills);

router.route("/company").get(getBempCompanyData)
                        .post(addBempCompany)
                        .put(updateBempCompany);

router.route("/vacants").get(getCompanyVacants)
                        .post(addCompanyVacant)
                        .put(updateCompanyVacant);
                        
router.route("/vacantskills").get(addVacantSkill)
                             .post(getVacantSkills)
                             .delete(removeVacantSkill);

module.exports = router;




