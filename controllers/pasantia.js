const { getQueryDB, queryDB, execProcedure} = require("../config/db");


exports.requestPasantia = async (req, res) => {

//Request statuses:
//onHold: User is pending to provide receiptNumber
//pending: User is waiting for approval from admin
//onGoing? || completed?: 

    const studentId = req.session.userData.idusuario;

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


    //Look for an existing request to update everything if required:


    const idsolicitud = await getQueryDB(` select * from solicitudes where idestudiante = '${studentId}'`);
    if(idsolicitud.length > 0){

        uPDATE REQUEST SOlicitud

    }
    else{ //If new request
        
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

    }

    res.status(200).json({
        success: true,
        data: {}
    });

};

/*




*/








exports.getStudentInformation = async (req, res) => { //DONE

    const studentId = req.session.userData.idusuario;

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

        if(!studentInformation.bolsaempleos) studentInformation.bolsaempleos = 0;
        if(!studentInformation.tipopasantia) studentInformation.tipopasantia = 0;
        
        studentInformation.bolsaempleos == '0' ? studentInformation.bolsaempleos = false : studentInformation.bolsaempleos = true;
        studentInformation.nombre = studentInformation.nombre.toUpperCase();
        studentInformation.apellido = studentInformation.apellido.toUpperCase();
        studentInformation["telefonos"] = phones;
        studentInformation["carrera"] = career[0].nombre.toUpperCase();
        studentInformation["idcarrera"] = career[0].idcarrera;
                
   
    res.status(200).json({

        success: true,
        data: studentInformation

    });
    


}

exports.updateStudentBemp = async (req, res) => { //DONE
    const studentId = req.session.userData.idusuario;
    const {isBemp} = req.body;
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
    const studentId = req.session.userData.idusuario;
    const {tipopasantia} = req.body;
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
