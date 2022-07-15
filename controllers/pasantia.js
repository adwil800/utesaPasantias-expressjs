const { getQueryDB, queryDB, execProcedure} = require("../config/db");


exports.requestPasantia = async (req, res) => {

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
            await execProcedure(`insertRequestData('${requestData.name}', '${requestData.type}', '${requestData.phone}', '${requestData.address}',
                                                    '${requestData.tutorName}', '${studentId}', ${requestData.receiptNumber}, 
                                                    '1', '${requestStatus}');`);
        } catch (errorCode) {
                console.log(errorCode)
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

exports.updateRequestPasantia = async (req, res) => {

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
            requestData.receiptNumber = `'${requestData.receiptNumber}'`;
        }
    
        if(requestData.type.trim() === "Otras"){
            requestData.type = requestData.otherType;
        }
    
    
        // UPDATE REQUEST SOlicitud  

        try {
            await execProcedure(`updateRequestData('${requestData.name}', '${requestData.type}', '${requestData.phone}', '${requestData.address}',
                                                    '${requestData.tutorName}', ${requestData.receiptNumber}, '${requestStatus}', '${requestData.reqId}');`);
        } catch (errorCode) {
                console.log(errorCode)
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
    





exports.getStudentRequest = async (req, res) => { //DONE

    //Temporary, pass studentId on params

    const {studentId} = req.query;

    const reqData = await getQueryDB(`select s.idsolicitud as reqId, s.numrecibo as receiptNumber, t.nombre as name, e.tipo as type, tel.telefono as phone, d.linea1 as address, (select nombre from terceros where idtercero =  re.idrepresentante) as tutorName from solicitudes as s 
                                     join terceros as t on t.idtercero = s.idempresa
                                     join empresas as e on e.idempresa = s.idempresa
                                     join telefonos_terceros as tt on tt.idtercero = s.idempresa
                                     join telefonos as tel on tel.idtelefono = tt.idtelefono
                                     join direcciones_terceros as dt on dt.idtercero = s.idempresa
                                     join direcciones as d on d.iddireccion = dt.iddireccion
                                     join representantes_empresas as re on re.idempresa = s.idempresa
                                     where idestudiante = '${studentId}';`);
    
    if(reqData.length > 0){
        reqData[0]["otherType"] = reqData[0].type;
        if(reqData[0].receiptNumber === null){
            reqData[0].receiptNumber = "";
        }
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



exports.getStudentRequestStatus = async (req, res) => { //DONE

    //Temporary, pass studentId on params
    const {studentId} = req.query;
    const reqData = await getQueryDB(`select s.idsolicitud as reqId, s.estado  as status, ae.bolsaempleos as bemp from solicitudes as s 
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

    const general = await getQueryDB(` select t.nombre, p.apellido, e.matricula, ae.bolsaempleos, ae.tipopasantia, d.linea1 as direccion, d.ciudad, d.provincia  from terceros as t 
    join estudiantes as e on t.idtercero = e.idestudiante
    join direcciones_terceros as dt on t.idtercero = dt.idtercero
    join personas as p on e.idestudiante = p.idpersona
    join adicionales_estudiantes as ae on ae.idestudiante = e.idestudiante
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
    const updateBemp = await queryDB(`UPDATE adicionales_estudiantes set bolsaempleos = '${Number(isBemp)}' where idestudiante = '${studentId}';`);


    if(updateBemp.success){
        return res.status(200).json({
            success: true,
            data: {}
        });
    }

    res.status(200).json({
        success: true,
        data: "Algo salió mal"
    });

};

exports.updateStudentTpasantia = async (req, res) => { //DONE
    const {tipopasantia, studentId} = req.body;
    const updateTpasantia = await queryDB(`UPDATE adicionales_estudiantes set tipopasantia = '${tipopasantia}' where idestudiante = '${studentId}';`);

    if(updateTpasantia.success){
        return res.status(200).json({
            success: true,
            data: {}
        });
    }

    res.status(200).json({
        success: true,
        data: "Algo salió mal"
    });
};



function errorMessage(errorCode){

    switch(errorCode){
        case 1146: return "Tabla inexistente";
        case 1062: return "Clave duplicada";
        case 1305: return "El recurso solicitado no existe";

        default: return "Error del servidor";
    }
}
