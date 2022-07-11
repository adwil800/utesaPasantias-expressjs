const {getQueryDB} = require("../config/db");
//CREATE ERROR HANDLER, SESSIONS ARE COMPLETED

exports.login = async (req, res) => {
    const {username, psw, campusId} = req.body;


    if(!username || !psw){
         res.status(200).json({
            success: false,
            data: "Usuario o contraseña no proporcionados.",
        });
        
        return;
    }
    
    //Get from BD
    let userData = await getQueryDB(`select * from usuarios where usuario = '${username}';`)

        if(userData.length < 1){
            
            res.status(200).json({
                success: false,
                data: "Usuario o contraseña incorrecto.",
            });
            
            return;
        }

        userData = userData[0];
    //idusuario, usuario, contra, tipo
    
    //logged in
    if(userData.usuario === username && userData.contra === psw){


        //Get user name and lastname
        let userInfo = await getQueryDB(`select t.nombre, p.apellido from estudiantes as e 
        join terceros as t on e.idestudiante = t.idtercero join personas as p 
        on e.idestudiante = p.idpersona where e.idestudiante = '${userData.idusuario}';`)
        
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
            data: "Usuario no detectado."
        });
    }

}

//Only logged in users with authorization level may access the route
exports.authorize = (...roles) => {
 


}


