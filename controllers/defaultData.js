
const asyncHandler = require("../middleware/asyncHandler")

const {execProcedure, getQueryDB } = require("../config/db");

//Route: /default/students
//Method: PUT

exports.pushStudents = async (req, res, next) => { //DONE

    const defaultStudents = [
        {
            name: "Adwil Rafael",
            lastName: "Castillo García",
            id: "1161609",
            career: "1",
        },
        {
            name: "John Albert",
            lastName: "Wick",
            id: "1171707",
            career: "1",
        },

    ]

    for (const student of defaultStudents) {

        try {
             await execProcedure(`insertStudent('${student.name}', '${student.lastName}', '${student.id}', '${student.career}')`);
               
           } catch (errorCode) {
   
               return res.status(400).json({
                   success: false,
                   data: {
                       error: errorMessage(errorCode),
                       errorCode
                       }
               });
   
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
             await execProcedure(`insertCareer('${career.name}', '${career.type}')`);
           } catch (errorCode) {
   
               return res.status(400).json({
                   success: false,
                   data: {
                       error: errorMessage(errorCode),
                       errorCode
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

        try {
             await execProcedure(`insertEmployee('${employee.name}', '${employee.lastName}')`);
               
           } catch (errorCode) {
   
               return res.status(400).json({
                   success: false,
                   data: {
                       error: errorMessage(errorCode),
                       errorCode
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
    const students = await getQueryDB("SELECT idestudiante, matricula FROM `estudiantes`");
    //get employees
    const employees = await getQueryDB("SELECT emp.idempleado, t.nombre FROM `empleados` as emp join terceros as t on t.idtercero = emp.idempleado");

    

    students.forEach(student => {
        defaultUsers.push({userId: student.idestudiante, username: student.matricula, 
                           psw: student.matricula, type: "user"});
    }); 

    employees.forEach(employee => {
        defaultUsers.push({userId: employee.idempleado, username: employee.nombre.split(" ")[0].toLowerCase() + employee.idempleado, 
                           psw: "admin", type: "admin"});
    }); 


    if(defaultUsers.length < 1){
        
        res.status(400).json({
            success: false,
            data: "No existen estudiantes ni empleados para la creación de usuarios.",
        });
        
        return;
    }



    for (const user of defaultUsers) {
        
        try {
            await  execProcedure(`insertUser('${user.userId}', '${user.username}', '${user.psw}', '${user.type}')`)
            
        } catch (errorCode) {

            return res.status(400).json({
                success: false,
                data: {
                    error: errorMessage(errorCode),
                    errorCode
                    }
            });

        }
        
    }

    res.status(201).json({
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
   
               return res.status(400).json({
                   success: false,
                   data: {
                       error: errorMessage(errorCode),
                       errorCode
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
  GENERAL GET QUERY
  
  SELECT r.idrecinto, t.nombre, dir.linea1, dir.ciudad, dir.provincia, dir.pais  FROM `recintos` as r 
  join `terceros` as t on t.idtercero = r.idrecinto
  join `direcciones_terceros` as dirt on dirt.idtercero = r.idrecinto 
  join direcciones as dir on dir.iddireccion = dirt.iddireccion;
 */ 

function errorMessage(errorCode){

    switch(errorCode){
        case 1062: return "Clave duplicada";

        default: return "Error del servidor";
    }
}