const { getQueryDB, queryDB, execProcedure} = require("../config/db");


//Solicitudes admin



exports.getNoBempRequests = async (req, res) => { //DONE
    try {
            const reqData = await getQueryDB(`select s.idsolicitud as reqId, s.idestudiante as studentId, est.matricula,
                                                 t.nombre as studentName, p.apellido as studentLastName,
                                                 s.idempresa as companyId, te.nombre as companyName, 
                                                 s.numrecibo as receiptNumber, s.fecha as reqDate from solicitudes as s
                                                 join adicionales_estudiantes as ae on ae.idestudiante = s.idestudiante
                                                 join estudiantes as est on est.idestudiante = s.idestudiante
                                                 join terceros as t on t.idtercero = s.idestudiante
                                                 join personas as p on p.idpersona = s.idestudiante
                                                 join terceros as te on te.idtercero = s.idempresa
                                                    where s.estado = 'pending' and ae.bolsaempleos = 0;`);
            
            return res.status(200).json({
                success: true,
                data: reqData
            })
            
    } catch (error) {
        res.status(200).json({

            success: false,
            data: {}
    
        });
    }
}


exports.getBempRequests = async (req, res) => { //DONE
    try {
            const reqData = await getQueryDB(`select s.idsolicitud as reqId, s.idestudiante as studentId, est.matricula,
                                                t.nombre as studentName, p.apellido as studentLastName,
                                                s.numrecibo as receiptNumber, s.fecha as reqDate from solicitudes as s
                                                join adicionales_estudiantes as ae on ae.idestudiante = s.idestudiante
                                                join estudiantes as est on est.idestudiante = s.idestudiante
                                                join terceros as t on t.idtercero = s.idestudiante
                                                join personas as p on p.idpersona = s.idestudiante
                                                where s.estado = 'pending' and ae.bolsaempleos = 1;`);
            
            return res.status(200).json({
                success: true,
                data: reqData
            })
            
    } catch (error) {
        res.status(200).json({

            success: false,
            data: {}
    
        });
    }
}






















//Request bemp
exports.requestBempPasantia = async (req, res) => {

    //Request statuses:
    //onHold: User is pending to provide receiptNumber
    //pending: User is waiting for approval from admin
    //onGoing? || completed?: 

    let {receiptNumber, studentId} = req.body;
    let requestStatus = "onHold";
    if(receiptNumber.trim().length === 0){
        //Set null : pending for user input, request is on hold
        receiptNumber = null;
        requestStatus = "onHold";

    }else{
        requestStatus = "pending";
    }


        try {
            if(receiptNumber === null)
            await execProcedure(`insertBempRequestData('${studentId}', ${receiptNumber}, '1', '${requestStatus}', NULL);`);
            else
            await execProcedure(`insertBempRequestData('${studentId}', '${receiptNumber}', '1', '${requestStatus}', '${getToday()}');`);
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
}

exports.updateRequestBempPasantia = async (req, res) => {

    //Request statuses:
    //onHold: User is pending to provide receiptNumber
    //pending: User is waiting for approval from admin
    //onGoing? || completed?: 


    let {receiptNumber, requestId} = req.body;
    let requestStatus = "onHold";

    if(receiptNumber.trim().length === 0){
        //Set null : pending for user input, request is on hold
        receiptNumber = null;
        requestStatus = "onHold";
 
    }else{
        requestStatus = "pending";
    }

        try {
            if(receiptNumber === null)
            await execProcedure(`updateBempRequestData('${requestId}', ${receiptNumber}, '${requestStatus}', NULL);`);
            else
            await execProcedure(`updateBempRequestData('${requestId}', '${receiptNumber}', '${requestStatus}', '${getToday()}');`);
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
}

exports.getStudentBempRequest = async (req, res) => { //DONE

    const {studentId} = req.query;

    try {
        
        const reqData = await getQueryDB(`select idsolicitud as reqId from solicitudes where idestudiante = '${studentId}';`);
        return res.status(200).json({
            success: true,
            data: reqData[0] || []
        })

    } catch (error) {
        res.status(200).json({

            success: false,
            data: {}
    
        });
    }


}


//Remove when user has already decided to go for bemp, 
//returns user to onHold status
exports.removeStudentBemp = async (req, res) => { //DONE
    const {isBemp, studentId} = req.body;
   
    try {
        
        await queryDB(`UPDATE adicionales_estudiantes set bolsaempleos = '${Number(isBemp)}' where idestudiante = '${studentId}';`);
        await queryDB(`UPDATE solicitudes set estado = 'onHold', fecha = NULL where idestudiante = '${studentId}';`);
        return res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        return res.status(200).json({
            success: false,
            data: {
                    error: errorMessage(error.errno),
                    message: error
                }
        });
        
    } 
};






//Request no bemp
exports.requestNoBempPasantia = async (req, res) => {

//Request statuses:
//onHold: User is pending to provide receiptNumber
//pending: User is waiting for approval from admin
//onGoing? || completed?: 


    const {requestData, studentId} = req.body;
    let requestStatus = "onHold";

    if(requestData.receiptNumber.trim().length === 0){
        //Set null : pending for user input, request is on hold
        requestData.receiptNumber = null;
        requestStatus = "onHold";

    }else{
        requestStatus = "pending";
    }

    if(requestData.type.trim() === "Otras"){
        requestData.type = requestData.otherType;
    } 
        try {
            if(requestData.receiptNumber === null){
            await execProcedure(`insertRequestData('${requestData.name}', '${requestData.type}', '${requestData.phone}', '${requestData.address}',
                                                    '${requestData.tutorName}', '${studentId}', ${requestData.receiptNumber}, 
                                                    '1', '${requestStatus}', '${requestData.cargo}', NULL);`);
            }
            else{
                
                await execProcedure(`insertRequestData('${requestData.name}', '${requestData.type}', '${requestData.phone}', '${requestData.address}',
                '${requestData.tutorName}', '${studentId}', '${requestData.receiptNumber}', 
                '1', '${requestStatus}', '${requestData.cargo}', '${getToday()}');`);
            }
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

exports.updateRequestNoBempPasantia = async (req, res) => {

    //Request statuses:
    //onHold: User is pending to provide receiptNumber
    //pending: User is waiting for approval from admin
    //onGoing? || completed?: 
    
        const {requestData} = req.body;
        let requestStatus = "onHold";
    
        if(requestData.receiptNumber.trim().length === 0){
            //Set null : pending for user input, request is on hold
            requestData.receiptNumber = null;
            requestStatus = "onHold";
    
        }else{
            requestStatus = "pending";
        }
    
        if(requestData.type.trim() === "Otras"){
            requestData.type = requestData.otherType;
        }
    
        // UPDATE REQUEST SOlicitud 
        try {
            if(requestData.receiptNumber === null){
                await execProcedure(`updateRequestData('${requestData.name}', '${requestData.type}', 
                '${requestData.phone}', '${requestData.address}', '${requestData.tutorName}', 
                ${requestData.receiptNumber}, '${requestStatus}', '${requestData.reqId}', '${requestData.cargo}', NULL);`);
            }
            else{
                await execProcedure(`updateRequestData('${requestData.name}', '${requestData.type}', 
                '${requestData.phone}', '${requestData.address}', '${requestData.tutorName}', 
                '${requestData.receiptNumber}', '${requestStatus}', '${requestData.reqId}', '${requestData.cargo}', '${getToday()}' );`);
            }
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
    
exports.getStudentNoBempRequest = async (req, res) => { //DONE

    //Temporary, pass studentId on params

    const {studentId} = req.query;

    try {
        //Check if theres a company
        
        const isCompany = await getQueryDB(`select idsolicitud as reqId, idempresa as companyId from solicitudes where idestudiante = '${studentId}'`);
        if(isCompany.length > 0){
            if(isCompany[0].companyId === null && isCompany[0].reqId){
                //Get req data
                const reqData = await getQueryDB(`select idsolicitud as reqId, numrecibo as receiptNumber from solicitudes where idestudiante = '${studentId}'`);
                reqData[0].noCompany = true;
                if(!reqData[0].receiptNumber) reqData[0].receiptNumber = ""; 
                return res.status(200).json({
                    success: true,
                    data: reqData[0]
                })

            }else{
                
                //theres a company within
                const reqData = await getQueryDB(`select s.idsolicitud as reqId,
                t.nombre as name, e.tipo as type, tel.telefono as phone, d.linea1 as address, 
                (select nombre from terceros where idtercero =  re.idrepresentante) as tutorName, re.cargo, s.numrecibo as receiptNumber from solicitudes as s 
                join terceros as t on t.idtercero = s.idempresa
                join empresas as e on e.idempresa = s.idempresa
                join telefonos_terceros as tt on tt.idtercero = s.idempresa
                join telefonos as tel on tel.idtelefono = tt.idtelefono
                join direcciones_terceros as dt on dt.idtercero = s.idempresa
                join direcciones as d on d.iddireccion = dt.iddireccion
                join representantes_empresas as re on re.idempresa = s.idempresa
                where idestudiante = '${studentId}';`);
                
                if(!reqData[0].receiptNumber) reqData[0].receiptNumber = ""; 
                reqData[0]["otherType"] = reqData[0].type;
                return res.status(200).json({
                    success: true,
                    data: reqData[0]
                })
            }
        }
        return res.status(200).json({
            success: false,
            noReq: true,
            data: {}
        })

    } catch (error) {
        res.status(200).json({

            success: false,
            data: {}
    
        });
    }
    




 
    


}



exports.getStudentRequestStatus = async (req, res) => { //DONE

    //Temporary, pass studentId on params
    const {studentId} = req.query;
    const reqData = await getQueryDB(`select s.idsolicitud as reqId, s.numrecibo, s.estado as status, ae.bolsaempleos as bemp from solicitudes as s 
    join adicionales_estudiantes as ae on ae.idestudiante = s.idestudiante where s.idestudiante = '${studentId}';`);
    
    if(reqData.length > 0){
        return res.status(200).json({
            success: true,
            data: reqData[0]
        })
    }

    res.status(200).json({

        success: false,
        noReq: true,
        data: {}

    });
    


}





exports.getStudentInformation = async (req, res) => { //DONE

    const {studentId} = req.query;

    const general = await getQueryDB(` select e.idestudiante, t.nombre, p.apellido, ap.correo, e.matricula, ae.bolsaempleos, ae.tipopasantia, d.linea1 as direccion, d.ciudad, d.provincia  from terceros as t 
    join estudiantes as e on t.idtercero = e.idestudiante
    join direcciones_terceros as dt on t.idtercero = dt.idtercero
    join personas as p on e.idestudiante = p.idpersona
    join adicionales_estudiantes as ae on ae.idestudiante = e.idestudiante
    join adicionales_personas as ap on ap.idpersona = e.idestudiante
    join direcciones as d on dt.iddireccion = d.iddireccion where t.idtercero = '${studentId}';`);


    const phones = await getQueryDB(`select tel.telefono  from telefonos_terceros as tt join telefonos as tel on tt.idtelefono = tel.idtelefono
                  join terceros as t on t.idtercero = tt.idtercero where t.idtercero = '${studentId}';`);
    const career = await getQueryDB(`select t.nombre, e.idcarrera from terceros as t 
                  join estudiantes as e on t.idtercero = e.idcarrera where e.idestudiante = '${studentId}';`);
    
    
    
    
    let studentInformation = general[0];

    if(studentInformation){
        if(!studentInformation.bolsaempleos) studentInformation.bolsaempleos = 0;
        if(!studentInformation.tipopasantia) studentInformation.tipopasantia = 0;
        
        studentInformation.bolsaempleos == '0' ? studentInformation.bolsaempleos = false : studentInformation.bolsaempleos = true;
        studentInformation.nombre = studentInformation.nombre.toUpperCase();
        studentInformation.apellido = studentInformation.apellido.toUpperCase();
        studentInformation["telefonos"] = phones;
        studentInformation["carrera"] = career[0].nombre.toUpperCase();
        studentInformation["idcarrera"] = career[0].idcarrera;
            
            
        return res.status(200).json({

            success: true,
            data: studentInformation

        });
    }
                
   
    
    res.status(200).json({

        success: false,
        data: {}

    });


}

exports.updateStudentBemp = async (req, res) => { //DONE
    const {isBemp, studentId} = req.body;

    try {
        
        const updateBemp = await queryDB(`UPDATE adicionales_estudiantes set bolsaempleos = '${Number(isBemp)}' where idestudiante = '${studentId}';`);
            
        if(updateBemp.success){
            //If had no bemp and wants to add it, remove company and representative if exists
            if(isBemp){ 
                //GOT TO COME BACK HERE, THE COMPANIES REGISTERED BY STUDENTS ARE STILL IN WITH THEIR RESPECTIVE REPS, HANDLE
                //Remove company relationship with request
                await queryDB(`UPDATE solicitudes set idempresa = NULL where idestudiante = '${studentId}';`);
            }

        }
        return res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        return res.status(200).json({
            success: false,
            data: {
                    error: errorMessage(error.errno),
                    message: error
                }
        });
        
    } 

};

exports.updateStudentTpasantia = async (req, res) => { //DONE
    const {tipopasantia, studentId} = req.body;

    
    try {
        
        await queryDB(`UPDATE adicionales_estudiantes set tipopasantia = '${tipopasantia}' where idestudiante = '${studentId}';`);
        return res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        return res.status(200).json({
            success: false,
            data: {
                    error: errorMessage(error.errno),
                    message: error
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
function getToday(){
    const today = new Date(); 
    const dateTime = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate() +" "+ today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
    return dateTime;
}
