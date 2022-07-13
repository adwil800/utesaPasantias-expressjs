const { getQueryDB, queryDB } = require("../config/db");



exports.getStudentInformation = async (req, res) => {

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


exports.requestPasantia = (req, res) => {

};

 /*

CREATE TABLE solicitudes(
    idsolicitud INT PRIMARY KEY AUTO_INCREMENT,
    idestudiante INT,
    FOREIGN KEY(idestudiante) REFERENCES estudiantes(idestudiante),
    idempresa INT,
    FOREIGN KEY(idempresa) REFERENCES empresas(idempresa),
    numrecibo INT,
    firma TINYINT,
    estado VARCHAR(255)
);


CREATE TABLE empresas(
    idempresa INT,
    tipo VARCHAR(255),
    PRIMARY KEY(idempresa),
    FOREIGN KEY (idempresa) REFERENCES terceros(idtercero),
    actividad VARCHAR(255)
); 
CREATE TABLE representantes_empresas(
    idrepresentante INT,
    FOREIGN KEY(idrepresentante) REFERENCES personas(idpersona),
    idempresa INT,
    FOREIGN KEY(idempresa) REFERENCES empresas(idempresa),
    cargo VARCHAR(255)
); 



CREATE TABLE formularios(
    idformulario INT PRIMARY KEY AUTO_INCREMENT,
    idestudiante INT,
    FOREIGN KEY(idestudiante) REFERENCES estudiantes(idestudiante),
    idempresa INT,
    FOREIGN KEY(idempresa) REFERENCES empresas(idempresa),
    fechaemision DATE
); 

CREATE TABLE formularios_inicio(
    idformularioinicio INT,
    FOREIGN KEY(idformularioinicio) REFERENCES formularios(idformulario),
    idjefedirecto INT,
    FOREIGN KEY(idjefedirecto) REFERENCES representantes_empresas(idrepresentante),
    fechainicio DATE,
    horario VARCHAR(255),
    tanda VARCHAR(255),
    funciones VARCHAR(255),
    firma TINYINT,
    estado VARCHAR(255)
);


  */



exports.updateStudentBemp = async (req, res) => {
    const studentId = req.session.userData.idusuario;
    const {isBemp} = req.body;
    const updateBemp = await queryDB(`UPDATE adicionales_estudiantes set bolsaempleos = '${Number(isBemp)}' where idestudiante = '${studentId}';`);


    if(updateBemp.success){
        return res.status(200).json({
            success: true,
            data: {}
        })
    }

};


exports.updateStudentTpasantia = async (req, res) => {
    const studentId = req.session.userData.idusuario;
    const {tipopasantia} = req.body;
    const updateTpasantia = await queryDB(`UPDATE adicionales_estudiantes set tipopasantia = '${tipopasantia}' where idestudiante = '${studentId}';`);

    if(updateTpasantia.success){
        return res.status(200).json({
            success: true,
            data: {}
        })
    }

};