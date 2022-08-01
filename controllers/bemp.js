const { getQueryDB, queryDB, execProcedure } = require("../config/db");


exports.addCompanyVacant = async (req, res) => {

    const {companyId, campusId, vName, careerId, vacantDesc} = req.body;
        try {
            await queryDB(`insert into vacantes_empresas (idempresa, idcarrera, idrecinto, nombre, descripcion) values ('${companyId}', '${careerId}', '${campusId}', '${vName}', '${vacantDesc}'); `)
        } catch (errorCode) {
            return res.status(200).json({
                success: false,
                data: {
                        error: errorMessage(errorCode.errno),
                        message: errorCode
                    }
            });
            
        }

    res.status(201).json({
        success: true,
        data: {}
    });

};


exports.updateCompanyVacant = async (req, res) => {

    const {vacantId, campusId, vName, careerId, vacantDesc} = req.body;
    //ASk wether a vacante can be in multiple recintos
        try {
            
            await queryDB(` update vacantes_empresas set nombre = '${vName}', descripcion = '${vacantDesc}', idcarrera = '${careerId}', idrecinto = '${campusId}' where idvacante = '${vacantId}'; `)
        } catch (errorCode) {
            return res.status(200).json({
                success: false,
                data: {
                        error: errorMessage(errorCode.errno),
                        message: errorCode
                    }
            });
            
        }

    res.status(200).json({
        success: true,
        data: {}
    });

};

exports.getCompanyVacants = async (req, res) => {

    const {companyId} = req.query;


    
    try {
     
        const vacants = await getQueryDB(`select ve.idvacante as id, ve.idcarrera as careerId, ve.idrecinto as campusId, ve.nombre as vName, t.nombre as career, ter.nombre as campus, 
                                        ve.descripcion as vacantDesc from vacantes_empresas as ve
                                        join terceros as t on t.idtercero = ve.idcarrera
                                        join terceros ter on ter.idtercero = ve.idrecinto where ve.idempresa = '${companyId}';`)

        return res.status(200).json({
            success: true,
            data: vacants 
        })

    } catch (error) {
        res.status(200).json({
            success: false,
            data: {}
        });
    }
        
};



exports.addVacantSkill = async (req, res) => {

    const {vacantId, skillId} = req.body;

        try {
            await queryDB(`insert into aptitudes_vacantes (idhabilidad, idvacante) values ('${skillId}', '${vacantId}'); `)
        } catch (errorCode) {
            return res.status(200).json({
                success: false,
                data: {
                        error: errorMessage(errorCode.errno),
                        message: errorCode
                    }
            });
            
        }

    res.status(201).json({
        success: true,
        data: {}
    });

};

exports.removeVacantSkill = async (req, res) => {

    const {skillId, vacantId} = req.query;

        try {
            await queryDB(`delete from aptitudes_vacantes where idhabilidad = '${skillId}' && idvacante = '${vacantId}'; `)
        } catch (errorCode) {
            return res.status(200).json({
                success: false,
                data: {
                        error: errorMessage(errorCode.errno),
                        message: errorCode
                    }
            });
            
        }

    res.status(200).json({
        success: true,
        data: {}
    });

};

exports.getVacantSkills = async (req, res) => {

    const {vacantId} = req.query;

    try {
        
        const skills = await getQueryDB(`select h.idhabilidad as skillId, h.nombre as skillName  from vacantes_empresas as ve 
        join aptitudes_vacantes as hv on ve.idvacante = hv.idvacante 
        join aptitudes as h on h.idhabilidad = hv.idhabilidad where ve.idvacante = '${vacantId}'`)
       
        return res.status(200).json({
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






//Bemp company 
exports.addBempCompany = async (req, res) => {//DONE

    const {requestData} = req.body;
        if(requestData.type.trim() === "Otras"){
            requestData.type = requestData.otherType;
        }

        try {
            await execProcedure(`insertCompanyBemp('${requestData.name}', '${requestData.type}', '${requestData.about}', '${requestData.phone}', '${requestData.address}',
                                                    '${requestData.tutorName}', '${requestData.cargo}');`);
                
            res.status(201).json({
                success: true,
                data: {}
            });

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
    
exports.updateBempCompany = async (req, res) => {//DONE

        const {requestData, companyId} = req.body;
    
        if(requestData.type.trim() === "Otras"){
            requestData.type = requestData.otherType;
        }
    
        // UPDATE REQUEST SOlicitud  

        try {
            await execProcedure(`updateCompanyBemp('${requestData.name}', '${requestData.type}', '${requestData.about}', '${requestData.phone}', '${requestData.address}', '${requestData.tutorName}', '${companyId}', '${requestData.cargo}');`);
           
            res.status(200).json({
                success: true,
                data: {}
            });
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
 
exports.getBempCompanies = async (req, res) => { //DONE
    
    try {

        const reqData = await getQueryDB(`select e.idempresa as id,  t.nombre as name, e.tipo as type, tel.telefono as phone, d.linea1 as address, (select nombre from terceros where idtercero =  re.idrepresentante) as tutorName, re.cargo, e.actividad as about from terceros as t join empresas as e on e.idempresa = t.idtercero
                                        join telefonos_terceros as tt on tt.idtercero = e.idempresa
                                        join telefonos as tel on tel.idtelefono = tt.idtelefono
                                        join direcciones_terceros as dt on dt.idtercero = e.idempresa
                                        join direcciones as d on d.iddireccion = dt.iddireccion
                                        join representantes_empresas as re on re.idempresa = e.idempresa where e.bolsaemp = 1;`);
        
        if(reqData.length > 0){
            reqData["otherType"] = reqData.type;
    
            reqData.forEach(e => {
                e["otherType"] = e.type;
            });
    
        
        }

        return res.status(200).json({
            success: true,
            data: reqData
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

 
//Student skills
exports.addStudentSkill = async (req, res) => { //DONE


    const {skillId, studentId} = req.body;
    
    try {
        await queryDB(`insert into aptitudes_estudiantes (idhabilidad, idestudiante) values ('${skillId}', '${studentId}');`);
    
        res.status(200).json({
            success: true,
            data: {}
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

exports.removeStudentSkills = async (req, res) => { //DONE


    const {skillId, studentId} = req.query;
    try {
        await queryDB(`delete from aptitudes_estudiantes where idhabilidad = '${skillId}' && idestudiante = '${studentId}';`);
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
        data: []
    })

};

exports.getStudentSkills = async (req, res) => { //DONE


    const {studentId} = req.query;

    try {
        const skills = await getQueryDB(`select ae.idhabilidad as skillId, a.nombre as skillName from aptitudes_estudiantes as ae join aptitudes as a on ae.idhabilidad = a.idhabilidad where idestudiante = '${studentId}'`);

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

exports.getStudentSkill = async (req, res) => { //DONE
 
    const {skillId, studentId} = req.query;

    try {
        const skills = await getQueryDB(`select idhabilidad as skillId from aptitudes_estudiantes where idestudiante = '${studentId}' and idhabilidad = '${skillId}'`);

        return res.status(200).json({
            success: true,
            data: skills[0] || []
        })

    } catch (error) {
        res.status(200).json({
            success: false,
            data: {}
        });
    }

};









//v assignation
exports.getBempStudents = async (req, res) => { //DONE

    try {
        const students = await getQueryDB(`  select e.idestudiante as studentId, e.matricula, t.nombre as studentName, p.apellido as studentLastName,
                                             e.idcarrera as careerId, t1.nombre as careerName, e.idrecinto as campusId, t2.nombre as campusName from estudiantes as e 
                                             join terceros as t on t.idtercero = e.idestudiante
                                             join terceros as t1 on t1.idtercero = e.idcarrera
                                             join terceros as t2 on t2.idtercero = e.idrecinto
                                             join personas as p on p.idpersona = e.idestudiante
                                             join adicionales_estudiantes as ae on ae.idestudiante = e.idestudiante where ae.bolsaempleos = 1;`);

        return res.status(200).json({
            success: true,
            data: students
        })

    } catch (error) {
        res.status(200).json({
            success: false,
            data: {}
        });
    }

};

exports.getVacantsByCampusCareer = async (req, res) => { //DONE
    
    const { campusId, careerId } = req.query;

    try {
        const vacants = await getQueryDB(`select ve.idempresa as companyId, t.nombre as companyName, ve.idvacante as vacantId, 
                                          ve.nombre as vName, ve.descripcion as vacantDesc from vacantes_empresas as ve 
                                          join terceros as t on t.idtercero = ve.idempresa
                                          where idrecinto = '${campusId}' AND idcarrera = '${careerId}';`);
 
        return res.status(200).json({
            success: true,
            data: vacants
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

function errorMessage(errorCode){

    switch(errorCode){
        case 1146: return "Tabla inexistente";
        case 1062: return "Clave duplicada";
        case 1305: return "El recurso solicitado no existe";

        default: return "Error del servidor";
    }
}