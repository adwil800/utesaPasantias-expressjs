const { getQueryDB, queryDB } = require("../config/db");



exports.addCareerSkill = async (req, res) => {

    const { careerId, skillName} = req.body;

    try {
        await queryDB(`insert into aptitudes (idcarrera, nombre) values ('${careerId}', '${skillName}');`);
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

exports.removeCareerSkill = async (req, res) => { 

    const { careerId, skillId } = req.query;
    
    try {
        await queryDB(`delete from aptitudes where idhabilidad = '${skillId}' && idcarrera = '${careerId}';`);
    } catch (errorCode) {
        return res.status(200).json({
            success: false,
            data: {
                    error: errorMessage(errorCode.errno),
                    message: errorCode.sqlMessage,
                    code: errorCode.errno
                }
        });
    }

    res.status(200).json({
        success: true,
        data: {}
    })

};

exports.getSkillsByCareer = async (req, res) => { //DONE

    const { careerId } = req.query;

    
    try {
        const skills = await getQueryDB(`select idhabilidad as skillId, nombre as skillName from aptitudes where idcarrera = '${careerId}'`);

        return res.status(200).json({
            success: true,
            data: skills 
        })

    } catch (error) {
        res.status(200).json({
            success: false,
            data: {}
        });
    }


};







exports.getAllCareers = async (req, res) => { //DONE

    try {
        const careers = await getQueryDB(`select c.idcarrera, t.nombre from carreras as c join terceros as t on idcarrera = idtercero;`);

        return res.status(200).json({
            success: true,
            data: careers 
        })

    } catch (error) {
        res.status(200).json({
            success: false,
            data: {}
        });
    }

};

exports.getStudentCareer = async (req, res) => { //DONE

    const {studentId} = req.query;

    try {
        const careerId = await getQueryDB(`select idcarrera from estudiantes where idestudiante = '${studentId}'`);

        return res.status(200).json({
            success: true,
            data: careerId[0]
        })

    } catch (error) {
        res.status(200).json({
            success: false,
            data: {}
        });
    }

};



function errorMessage(errorCode){

    switch(errorCode){
        case 1062: return "Clave duplicada";
        case 1305: return "El recurso solicitado no existe";
        case 1451: return "El recurso solicitado está siendo utilizado"

        default: return "Error del servidor";
    }
}
