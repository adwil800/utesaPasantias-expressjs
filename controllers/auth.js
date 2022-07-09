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
    let userData = await getQueryDB(`select * from usuarios where usuario = '${username}'`)

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

    const {idusuario, usuario, tipo} = req.session.userData;

    if(req.session.userData){
         res.status(200).json({
            success: true,
            data: {idusuario, usuario, tipo}
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


