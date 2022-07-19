const {getQueryDB} = require("../config/db");
//CREATE ERROR HANDLER, SESSIONS ARE COMPLETED

exports.login = async (req, res) => {
    const {username, psw, campusId} = req.body;


    if(!username || !psw || !campusId){
         res.status(200).json({
            success: false,
            data: "Usuario o contraseña no proporcionados.",
        });
        
        return;
    }
    
    //Get from BD
    let userData = await getQueryDB(`select * from usuarios where usuario = '${username}';`)
        if(userData.length < 1){
            
            return res.status(200).json({
                success: false,
                data: "Usuario o contraseña incorrecto",
            });

        }

        userData = userData[0];
    //idusuario, usuario, contra, tipo
    
        if(userData.tipo === "user"){
            let campus = await getQueryDB(`select e.idrecinto from estudiantes as e where e.idestudiante = '${userData.idusuario}';`)
            if(campus.length > 0){
                userData["idrecinto"] = campus[0].idrecinto;
            }else{

                return res.status(200).json({
                    success: false,
                    data: "Error del servidor",
                });
                
            }
        }
        
        else if(userData.tipo === "admin"){
            let campus = await getQueryDB(`select e.idrecinto from empleados as e where e.idempleado = '${userData.idusuario}';`)
            if(campus.length > 0){
                userData["idrecinto"] = campus[0].idrecinto;
            }else{

                return res.status(200).json({
                    success: false,
                    data: "Error del servidor",
                });
                
            }
        }


        //logged in
    if(userData.usuario === username && userData.contra === psw && userData.idrecinto.toString() === campusId.toString()){


        //Get user name and lastname
        let userInfo = await getQueryDB(`select t.nombre, p.apellido from terceros as t 
        join personas as p on t.idtercero = p.idpersona where t.idtercero = '${userData.idusuario}';`)
        

        userData["nombre"] = userInfo[0].nombre;
        userData["apellido"] = userInfo[0].apellido;

        //Remove password from object after validation 
        delete userData.contra;

        //Set session data
        req.session.userData = userData;
        res.status(200).json({
            success: true,
            data: userData.usuario,
        });

    }else{
        //Wrong credentials
         res.status(200).json({
            success: false,
            data: "Usuario o contraseña incorrecto.",
        });
    }
    



}

exports.logout = (req, res) => {

    req.session.destroy();

    res.status(200).json({
        success: true,
        loggedOut: true, 
    });

}

exports.getMe = (req, res) => {


    if(req.session.userData){
         res.status(200).json({
            success: true,
            data: req.session.userData
        });
    }

}
//Only logged in users may access the route
exports.protectRoute = (req, res, next) => {

    if(req.session.userData){
        //Usuario autorizado
        next();
    }else{
        res.status(200).json({
            success: false,
            isLoggedIn: false,
            data: "La sesión ha expirado"
        });
    }

}

//Only logged in users with authorization level may access the route
exports.authorize = (...roles) => {
 


}

exports.getCampus = async (req, res) => {


    const recintos = await getQueryDB("select r.idrecinto, t.nombre from recintos as r join terceros as t on t.idtercero = r.idrecinto;");

    if(recintos.length > 0){
        return res.status(200).json({
            success: true,
            data: recintos
        })
    }

    res.status(200).json({
        success: false,
        data: []
    })

}


