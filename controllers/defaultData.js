

const {execProcedure, getQueryDB, queryDB } = require("../config/db");

//Route: /default/students
//Method: PUT

exports.pushStudents = async (req, res, next) => { //DONE

    const defaultStudents = [
        {
            name: "Adwil Rafael",
            lastName: "Castillo García",
            matricula: "1161609",
            career: "1",
            recinto: "2",

            cedula: "40213907534",
            phones: [{number: "8096195358", type: "Movil"}, {number: "8096121758", type: "Casa"}],
            address: {
                fullAddress: "Av estrella sadhalá",
                city: "Santiago",
                province: "Santiago de los caballeros",
                country: "República Dominicana"
            } 
        },
        {
            name: "John Mike",
            lastName: "Sins",
            matricula: "1161611",
            career: "1",
            recinto: "2",

            cedula: "40213907534",
            phones: [{number: "8096195358", type: "Movil"}, {number: "8096121758", type: "Casa"}],
            address: {
                fullAddress: "Av estrella sadhalá",
                city: "Santiago",
                province: "Santiago de los caballeros",
                country: "República Dominicana"
            } 
        },
        

    ]

    for (const student of defaultStudents) {

        try {
                const studentId = await execProcedure(`insertStudent('${student.name}', '${student.lastName}', '${student.matricula}', '${student.career}', '${student.recinto}', 
                                                                     '${student.cedula}', '${student.address.fullAddress}', '${student.address.city}', 
                                                                     '${student.address.province}', '${student.address.country}', @studentId); select @studentId;`);

                for (const phone of student.phones) {

                    await execProcedure(`insertPhone('${phone.number}', '${phone.type}', '${studentId[0]["@studentId"]}');`);
                        
                }
               
           } catch (errorCode) {
            continue;
            /** 
            return res.status(200).json({
                success: false,
                data: {
                    error: errorMessage(errorCode.errno),
                    message: errorCode.sqlMessage
                    }
            });*/
   
           }
    }

    res.status(201).json({
        success: true,
        data: {}
    });
}; 

exports.pushCareers = async (req, res, next) => { //DONE

    const defaultCareers = [
        {
            name: "Ingeniería en Sistemas Computacionales",
            type: "Arquitectura e Ingeniería",
        },

    ]

    for (const career of defaultCareers) {

        try {
            await  execProcedure(`insertCareer('${career.name}', '${career.type}')`);
           } catch (errorCode) {
   
            return res.status(200).json({
                success: false,
                data: {
                    error: errorMessage(errorCode.errno),
                    message: errorCode.sqlMessage
                    }
            });
   
           }
    }

    res.status(201).json({
        success: true,
        data: {}
    });

};

exports.pushEmployees = async (req, res, next) => { //DONE

    const defaultEmployees = [
        {
            name: "Maria Altagracia",
            lastName: "Jimenez Tavarez",
            matricula: "1123342",
            recinto: "2",

            cedula: "4023594962",
            phones: [{number: "8496578896", type: "Casa"}],
            address: {
                fullAddress: "Av estrella sadhalá",
                city: "Santiago",
                province: "Santiago de los caballeros",
                country: "República Dominicana"
            } 
        },
        {
            name: "Jose Marcos",
            lastName: "García Lora",
            matricula: "1123343",
            recinto: "2",

            cedula: "4029845554",
            phones: [{number: "8295567985", type: "Movil"}],
            address: {
                fullAddress: "Av estrella sadhalá",
                city: "Santiago",
                province: "Santiago de los caballeros",
                country: "República Dominicana"
            } 
        } 
    ];

    for (const employee of defaultEmployees) {

        try {
                const employeeId = await execProcedure(`insertEmployee('${employee.name}', '${employee.lastName}', '${employee.matricula}', '${employee.recinto}', 
                                                                     '${employee.cedula}', '${employee.address.fullAddress}', '${employee.address.city}', 
                                                                     '${employee.address.province}', '${employee.address.country}', @employeeId); select @employeeId;`);

                for (const phone of employee.phones) {

                    await execProcedure(`insertPhone('${phone.number}', '${phone.type}', '${employeeId[0]["@employeeId"]}');`);
                        
                }
               
           } catch (errorCode) {
   
            return res.status(200).json({
                success: false,
                data: {
                    error: errorMessage(errorCode.errno),
                    message: errorCode.sqlMessage
                    }
            });
   
           }
    }



    res.status(201).json({
        success: true,
        data: {}
    });

};

exports.pushUsers = async (req, res, next) => { //DONE 
    //Create an user for each student / employee
    const defaultUsers = [];

    //get students
    const students = await getQueryDB("SELECT idestudiante, matricula FROM `estudiantes`;");
    //get employees
    const employees = await getQueryDB("SELECT idempleado, matricula FROM `empleados`;");

    students.forEach(student => {
        defaultUsers.push({userId: student.idestudiante, username: student.matricula, 
                           psw: student.matricula, type: "user"});
    }); 

    employees.forEach(employee => {
        defaultUsers.push({userId: employee.idempleado, username: employee.matricula, 
                           psw: employee.matricula, type: "admin"});
    }); 

    if(defaultUsers.length < 1){
        
        res.status(200).json({
            success: false,
            data: "No existen estudiantes ni empleados para la creación de usuarios.",
        });
        
        return;
    }



    for (const user of defaultUsers) {
        
        try {
            await execProcedure(`insertUser('${user.userId}', '${user.username}', '${user.psw}', '${user.type}')`)
            
        } catch (errorCode) {

            continue;
            /**
            return res.status(200).json({
                success: false,
                data: {
                    error: errorMessage(errorCode.errno),
                    message: errorCode.sqlMessage
                    }
            }); */

        }
        
    }

    res.status(200).json({
        success: true,
        data: {}
    });

 
};

exports.pushCampus = async (req, res, next) => { //DONE

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

    for (const campus of defaultCampus) {
        const address = campus.address;
        try {
            await execProcedure(`insertCampus('${campus.name}', '${address.fullAddress}',
                                               '${address.city}', '${address.province}', '${address.country}')`);
               
           } catch (errorCode) {
   
            return res.status(200).json({
                success: false,
                data: {
                    error: errorMessage(errorCode.errno),
                    message: errorCode.sqlMessage
                    }
            });r
   
           }
    }

    res.status(201).json({
        success: true,
        data: {}
    });

};

exports.pushSkills = async (req, res, next) => { //DONE

    const defaultSkills = [
        {
            skillName: "C++",
            career: "1"
        },
        {
            skillName: "Javascript",
            career: "1"
        },
        {
            skillName: "Html & css",
            career: "1"
        },
    ]

    for (const skill of defaultSkills) {
        try {
                await queryDB(`insert into habilidades (idcarrera, nombre) values ('${skill.career}', '${skill.skillName}')`);
           } catch (errorCode) {
                return res.status(200).json({
                    success: false,
                    data: {
                        error: errorMessage(errorCode.errno),
                        message: errorCode.sqlMessage
                        }
                });
   
           }
    }

    res.status(201).json({
        success: true,
        data: {}
    });

};

/**
    this.pushCareers();
    this.pushCampus();
    this.pushEmployees();
    this.pushStudents();
    this.pushUsers();
 */
/**
  GENERAL GET QUERY
  
  SELECT r.idrecinto, t.nombre, dir.linea1, dir.ciudad, dir.provincia, dir.pais  FROM `recintos` as r 
  join `terceros` as t on t.idtercero = r.idrecinto
  join `direcciones_terceros` as dirt on dirt.idtercero = r.idrecinto 
  join direcciones as dir on dir.iddireccion = dirt.iddireccion;
 */ 

function errorMessage(errorCode){

    switch(errorCode){
        case 1062: return "Clave duplicada";
        case 1305: return "El recurso solicitado no existe";

        default: return "Error del servidor";
    }
}



exports.testRoute = async (req, res, next) => { //DONE


       
    res.status(200).json({
        success: true,
        data: "TESTED"
    });
};
 