const { getQueryDB, queryDB } = require("../config/db");



exports.addStudentSkill = async (req, res) => { //DONE


    const {skillId, studentId} = req.body;
    
    try {
        await queryDB(`insert into habilidades_estudiantes (idhabilidad, idestudiante) values ('${skillId}', '${studentId}');`);
    } catch (errorCode) {
        return res.status(200).json({
            success: false,
            data: {
                error: errorMessage(errorCode.errno),
                message: errorCode.sqlMessage
                }
        });
    }


    res.status(200).json({
        success: true,
        data: {}
    })
};

exports.removeStudentSkills = async (req, res) => { //DONE


    const {skillId, studentId} = req.query;
    try {
        await queryDB(`delete from habilidades_estudiantes where idhabilidad = '${skillId}' && idestudiante = '${studentId}';`);
    } catch (errorCode) {
        return res.status(200).json({
            success: false,
            data: {
                error: errorMessage(errorCode.errno),
                message: errorCode.sqlMessage
                }
        });
    }

     res.status(200).json({
        success: true,
        data: {}
    })

};

exports.getStudentSkills = async (req, res) => { //DONE


    const {studentId} = req.query;
    const skills = await getQueryDB(`select idhabilidad as skillId from habilidades_estudiantes where idestudiante = '${studentId}'`);

    if(skills.length > 0){
        return res.status(200).json({
            success: true,
            data: skills
        })
    }

    res.status(200).json({
        success: false,
        data: ""
    })

};

exports.getStudentSkill = async (req, res) => { //DONE
 
    const {skillId, studentId} = req.query;
    const skills = await getQueryDB(`select idhabilidad as skillId from habilidades_estudiantes where idestudiante = '${studentId}' and idhabilidad = '${skillId}'`);

    if(skills.length > 0){
        return res.status(200).json({
            success: true,
            data: skills[0]
        })
    }

    res.status(200).json({
        success: false,
        data: {}
    })

};

exports.getSkillsByCareer = async (req, res) => { //DONE


    
    const {careerId} = req.query;
    const skills = await getQueryDB(`select idhabilidad as skillId, nombre as name from habilidades where idcarrera = '${careerId}';`);
    if(skills.length > 0){
        return res.status(200).json({
            success: true,
            data: skills
        })
    }

    res.status(200).json({
        success: false,
        data: {}
    })

};


function errorMessage(errorCode){

    switch(errorCode){
        case 1146: return "Tabla inexistente";
        case 1062: return "Clave duplicada";
        case 1305: return "El recurso solicitado no existe";

        default: return "Error del servidor";
    }
}