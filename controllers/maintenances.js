const { getQueryDB, queryDB } = require("../config/db");



exports.addCareerSkill = async (req, res) => {

    const { careerId, skillName} = req.body;

    try {
        await queryDB(`insert into habilidades (idcarrera, nombre) values ('${careerId}', '${skillName}');`);
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
        await queryDB(`delete from habilidades where idhabilidad = '${skillId}' && idcarrera = '${careerId}';`);
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

exports.getCareerSkills = async (req, res) => { //DONE

    const { careerId } = req.query;
    const careers = await getQueryDB(`select idhabilidad as skillId, nombre as skillName from habilidades where idcarrera = '${careerId}'`);

    if(careers.length > 0){
        return res.status(200).json({
            success: true,
            data: careers
        })
    }

    res.status(200).json({
        success: false,
        data: []
    })

};







exports.getAllCareers = async (req, res) => { //DONE


    const careers = await getQueryDB(`select c.idcarrera, t.nombre from carreras as c join terceros as t on idcarrera = idtercero;`);

    if(careers.length > 0){
        return res.status(200).json({
            success: true,
            data: careers
        })
    }

    res.status(200).json({
        success: false,
        data: []
    })

};

exports.getStudentCareer = async (req, res) => { //DONE

    const {studentId} = req.query;

    const careerId = await getQueryDB(`select idcarrera from estudiantes where idestudiante = '${studentId}'`);

    if(careerId.length > 0){
        return res.status(200).json({
            success: true,
            data: careerId[0]
        })
    }

    res.status(200).json({
        success: false,
        data: ""
    })

};



function errorMessage(errorCode){

    switch(errorCode){
        case 1062: return "Clave duplicada";
        case 1305: return "El recurso solicitado no existe";
        case 1451: return "El recurso solicitado está siendo utilizado"

        default: return "Error del servidor";
    }
}
