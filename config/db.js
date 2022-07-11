let mysql = require('mysql');
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "pasantias",
    multipleStatements: true,
});


const testDBConnection = (req, res, next) => {
    pool.getConnection( (err, connection) => {

        if(err)
            if(err.fatal){
                res.status(200).json({success: false, data: "No se pudo establecer conexión con la base de datos"})
                return;    
            }
            
        next();
  
    });
      
}



const getQueryDB =  (query) => {

    return new Promise(( resolve, reject ) => {

        pool.getConnection( (err, connection) => {
            
            connection.query(query, ( err, rows) => {

                if ( err ) {
                    reject( err );
                } else {
                    resolve(Object.values(JSON.parse(JSON.stringify(rows))));
                }

                connection.release();

            });

        });

    });


}



   //async to follow the flow of connect -> query -> end connection
const execProcedure = (procedure) => {
  
    
    return new Promise(( resolve, reject ) => {

        pool.getConnection( (err, connection) => {
                
        

                connection.query("call "+procedure, ( err, rows) => {

                    if ( err ) {
                        reject( err );
                    } else {
                        if(rows.length > 0)
                            resolve(Object.values(JSON.parse(JSON.stringify(rows[rows.length - 1]))));
                        else
                            resolve({success: true})
                    }

                    connection.release();

                });


        });

    });


};

module.exports = {getQueryDB, execProcedure, testDBConnection};


