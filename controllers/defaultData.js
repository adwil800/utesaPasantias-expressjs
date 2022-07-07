
const {execProcedure } = require("../config/db");

//Route: /default/students
//Method: PUT

exports.pushStudents = (req, res, next) =>{

    const defaultStudents = [
        {
            name: "Adwil Rafael",
            lastName: "Castillo García",
            career: "Ingeniería en sistemas computacionales",
        },

    ]
    console.log("YEZ")

};
/**
 * 
CREATE TABLE terceros(
    idtercero INT PRIMARY KEY,
    nombre VARCHAR(255)
); 
CREATE TABLE personas(
    idpersona INT,
    apellido VARCHAR(255),
    PRIMARY KEY(idpersona),
    FOREIGN KEY(idpersona) REFERENCES terceros(idtercero)
);
CREATE TABLE estudiantes(
    idestudiante INT,
    idcarrera INT,
            Matricula?
    PRIMARY KEY(idestudiante),
    FOREIGN KEY(idestudiante) REFERENCES personas(idpersona),
    FOREIGN KEY(idcarrera) REFERENCES carreras(idcarrera)
); 

 */
exports.pushCareers = (req, res, next) =>{

    const defaultCareers = [
        {
            name: "Ingeniería en Sistemas Computacionales",
            type: "Arquitectura e Ingeniería",
            status: "1"
        },

    ]


};

/**

CREATE TABLE carreras(
    idcarrera INT,
    PRIMARY KEY(idcarrera),
    FOREIGN KEY(idcarrera) REFERENCES terceros(idtercero),
    tipo VARCHAR(255),
    estado TINYINT
); 

 */

exports.pushEmployees = async (req, res, next) =>{ //DONE

    const defaultEmployees = [
        {
            name: "Maria Altagracia",
            lastName: "Jimenez Tavarez",
        },
        {
            name: "Jose Marcos",
            lastName: "García Lora",
        },
        {
            name: "William Alberto",
            lastName: "Reyes Sosa",
        },
    ];

    for (const employee of defaultEmployees) {
        await execProcedure(`insertEmployee('${employee.name}', '${employee.lastName}')`);
    }

    res.status(200).json({
        success: true,
    });


};
/***
    DELIMITER &&  
    CREATE PROCEDURE insertEmployee (IN nombre varchar(255), IN apellido varchar(255))  
    BEGIN  
    
        insert into terceros (`nombre`) values (nombre); 
        SET @terId = LAST_INSERT_ID();

        insert into personas (`idpersona`, `apellido`) values (@terId, apellido);
        
        insert into empleados (`idempleado`) values (@terId);

    END &&  
    DELIMITER ;  
 */
/**
 
CREATE TABLE terceros(
    idtercero INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255)
); 
CREATE TABLE personas(
    idpersona INT,
    apellido VARCHAR(255),
    PRIMARY KEY(idpersona),
    FOREIGN KEY(idpersona) REFERENCES terceros(idtercero)
);
CREATE TABLE empleados(
    idempleado INT,
    PRIMARY KEY (idempleado),
    FOREIGN KEY (idempleado) REFERENCES personas(idpersona)
);
 */

exports.pushUsers = async (req, res, next) =>{

    const defaultUsers = [
        {
            userId: "1", //empleado o estudiante x
            username: "admin",
            psw: "admin",
            type: "admin"
        },
        {
            userId: "2", 
            username: "1161609",
            psw: "123",
            type: "user"
        },
    ]


    for (const user of defaultUsers) {
       await execProcedure(`insertUser('${user.userId}', '${user.username}', '${user.psw}', '${user.type}')`);
    }

    res.status(200).json({
        success: true,
    });

};

/***
    DELIMITER &&  
    CREATE PROCEDURE insertUser (IN idusuario INT, IN usuario varchar(255), IN contra varchar(255), IN tipo varchar(255))  
    BEGIN  
    
        insert into usuarios (`idusuario`, `usuario`,`contra`, `tipo`) values (idusuario, usuario, contra, tipo);

    END &&  
    DELIMITER ;  
*/
/**
CREATE TABLE usuarios(
    idusuario INT,
    PRIMARY KEY (idusuario),
    FOREIGN KEY(idusuario) REFERENCES personas(idpersona),
    usuario VARCHAR(255),
    contra VARCHAR(255),
    tipo VARCHAR(255)
);
 */ 

exports.pushCampus = (req, res, next) =>{

    const defaultCampus = [
        {
            name: "Santiago",
            address: {
                fullAddress: "Av estrella sadhalá",
                city: "Santiago",
                province: "Santiago de los caballeros",
                country: "República Dominicana"
            }
        },
    ]


};


/**x
CREATE TABLE recintos(
    idrecinto INT,
        nombre? o bien referencia a tercero**********
    iddireccion INT,
    PRIMARY KEY(idrecinto),
    FOREIGN KEY (iddireccion) REFERENCES direcciones(iddireccion)
); 
 CREATE TABLE direcciones(
    iddireccion INT,
    linea1 VARCHAR(255),
    linea2 VARCHAR(255),
    ciudad VARCHAR(255),
    provincia VARCHAR(255),
    pais VARCHAR(255),
    PRIMARY KEY(iddireccion)
);

*/
