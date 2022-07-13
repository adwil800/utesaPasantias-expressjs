


const sessionActiveChecker = (req, res, next) => {
    

    if(!req.session.userData){
        res.status(200).json({
            success: false,
            sessionAlive: false,
            data: "La sesión ha expirado"
        });
    }else{
        next();
    }
}



module.exports = sessionActiveChecker;




