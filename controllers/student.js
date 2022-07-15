const { getQueryDB } = require("../config/db");



exports.getCareer = async (req, res) => { //DONE

    const {studentId} = req.query;

    const careerId = await getQueryDB(`select idcarrera from estudiantes where idestudiante = '${studentId}'`);

    if(careerId.length > 0){
        return res.status(200).json({
            success: true,
            data: careerId[0]
        })
    }

    res.status(200).json({
        success: false,
        data: ""
    })

};
