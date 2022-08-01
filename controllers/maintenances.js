const { getQueryDB, queryDB } = require("../config/db");



exports.addCareerSkill = async (req, res) => {

    const { careerId, skillName} = req.body;

    try {
        await queryDB(`insert into aptitudes (idcarrera, nombre) values ('${careerId}', '${skillName}');`);
        
            
        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (errorCode) {
         res.status(200).json({
            success: false,
            data: {
                error: errorMessage(errorCode.errno),
                message: errorCode.sqlMessage
                }
        });
    }

 
};

exports.removeCareerSkill = async (req, res) => { 

    const { careerId, skillId } = req.query;
    
    try {
        await queryDB(`delete from aptitudes where idhabilidad = '${skillId}' && idcarrera = '${careerId}';`);
        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (errorCode) {
         res.status(200).json({
            success: false,
            data: {
                    error: errorMessage(errorCode.errno),
                    message: errorCode.sqlMessage,
                    code: errorCode.errno
                }
        });
    }

   

};

exports.getSkillsByCareer = async (req, res) => { //DONE

    const { careerId } = req.query;

    
    try {
        const skills = await getQueryDB(`select idhabilidad as skillId, nombre as skillName from aptitudes where idcarrera = '${careerId}'`);

         res.status(200).json({
            success: true,
            data: skills 
        })

    } catch (error) {
        res.status(200).json({
            success: false,
            data: {
                error: errorMessage(error.errno),
                message: error.sqlMessage
                }
        });
    }


};







exports.getAllCareers = async (req, res) => { //DONE

    try {
        const careers = await getQueryDB(`select c.idcarrera, t.nombre from carreras as c join terceros as t on idcarrera = idtercero;`);

         res.status(200).json({
            success: true,
            data: careers 
        })

    } catch (error) {
        res.status(200).json({
            success: false,
            data: {
                error: errorMessage(error.errno),
                message: error.sqlMessage
                }
        });
    }

};

exports.getStudentCareer = async (req, res) => { //DONE

    const {studentId} = req.query;

    try {
        const careerId = await getQueryDB(`select idcarrera from estudiantes where idestudiante = '${studentId}'`);

        res.status(200).json({
            success: true,
            data: careerId[0]
        })

    } catch (error) {
        res.status(200).json({
            success: false,
            data: {
                error: errorMessage(error.errno),
                message: error.sqlMessage
                }
        });
    }

};


exports.getCompanyById = async (req, res) => { //DONE
    
    const { companyId } = req.query;

    try {

        const reqData = await getQueryDB(`select t.nombre as name, e.tipo as type, e.actividad as about, tel.telefono as phone, d.linea1 as address, (select nombre from terceros where idtercero =  re.idrepresentante) as tutorName, re.cargo from terceros as t join empresas as e on e.idempresa = t.idtercero
                                        join telefonos_terceros as tt on tt.idtercero = e.idempresa
                                        join telefonos as tel on tel.idtelefono = tt.idtelefono
                                        join direcciones_terceros as dt on dt.idtercero = e.idempresa
                                        join direcciones as d on d.iddireccion = dt.iddireccion
                                        join representantes_empresas as re on re.idempresa = e.idempresa where e.idempresa = '${companyId}';`);
        
        res.status(200).json({
            success: true,
            data: reqData[0]
        })

    } catch (error) {
        res.status(200).json({
            success: false,
            data: {
                error: errorMessage(error.errno),
                message: error.sqlMessage
                }
        });
    }
  
    


}

function errorMessage(errorCode){

    switch(errorCode){
        case 1062: return "Clave duplicada";
        case 1305: return "El recurso solicitado no existe";
        case 1451: return "El recurso solicitado está siendo utilizado"

        default: return "Error del servidor";
    }
}
